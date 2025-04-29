import { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Form,
  Alert,
  ListGroup,
} from "react-bootstrap";
import { authService } from "../services/auth.service";
import { useAuth } from "../contexts/auth/AuthProvider";
import { Link } from "react-router-dom";

const AuthenticationVulnerabilities = () => {
  const { user } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [brute, setBrute] = useState(false);
  const [exploitExpiredToken, setExploitExpiredToken] = useState(false);
  const [tokens, setTokens] = useState({
    access: "",
    refresh: "",
    expiredAccess: "",
  });
  const [bruteForceResults, setBruteForceResults] = useState<{
    attempts: number;
    success: boolean;
    foundPassword?: string;
  } | null>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // VULNERABLE: Demonstrating no token expiration check
  const handleExploitExpiredToken = async () => {
    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      // Normally this should fail because the token is expired
      // But the backend doesn't check token expiration
      localStorage.setItem(
        "auditorium_access_token",
        tokens.expiredAccess ||
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2MDAwMDAwMDAsInVzZXJfaWQiOiIxIiwicm9sZSI6ImFkbWluIn0.INVALID-SIGNATURE"
      );

      // Try to make a request with expired token
      const user = await fetch("/api/users/me", {
        headers: {
          Authorization: `Bearer ${tokens.expiredAccess}`,
        },
      }).then((res) => res.json());

      if (user && !user.error) {
        setSuccess(
          "Successfully accessed API with expired token! This is a serious authentication vulnerability."
        );
      } else {
        setError(
          "Expired token was rejected. The backend is checking expiration properly."
        );
      }
    } catch (err: any) {
      console.error("Token validation error:", err);
      setError(err.message || "An error occurred with token validation");
    } finally {
      setIsLoading(false);
    }
  };

  // VULNERABLE: Brute force attack due to no rate limiting
  const handleBruteForceAttack = async () => {
    if (!email) {
      setError("Please enter an email for the brute force demonstration");
      return;
    }

    setIsLoading(true);
    setError("");
    setSuccess("");
    setBruteForceResults(null);

    try {
      // This is a list of common passwords to try in the brute force attack
      const commonPasswords = [
        "password",
        "123456",
        "admin",
        "welcome",
        "test123",
        "password123",
        "qwerty",
        "letmein",
        "monkey",
        "1234",
        "12345",
      ];

      // Start the brute force attack - this works because there's no rate limiting
      const result = await authService.bruteForceLogin(email, commonPasswords);

      if (result) {
        setBruteForceResults({
          attempts: commonPasswords.indexOf(result) + 1,
          success: true,
          foundPassword: result,
        });
        setSuccess(`Brute force attack successful! Found password: ${result}`);
      } else {
        setBruteForceResults({
          attempts: commonPasswords.length,
          success: false,
        });
        setError(
          "Brute force attack failed. None of the common passwords worked."
        );
      }
    } catch (err: any) {
      console.error("Brute force error:", err);
      setError(
        err.message || "An error occurred during the brute force attack"
      );
    } finally {
      setIsLoading(false);
    }
  };

  // VULNERABLE: Shows how weak random might be vulnerable
  const simulateWeakOTP = () => {
    // Simulate the weak PRNG used on the backend
    const now = new Date();
    const seed =
      now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();
    const weakRandom = (seed * 9301 + 49297) % 233280;
    const predictedOTP = Math.floor(100000 + (weakRandom / 233280) * 900000);

    setSuccess(`Predicted OTP based on timestamp: ${predictedOTP}`);
  };

  return (
    <Container className="py-4">
      <h1 className="mb-4">Authentication Vulnerabilities Demo</h1>
      <Alert variant="danger">
        <Alert.Heading>Security Education Tool</Alert.Heading>
        <p>
          This page demonstrates serious authentication vulnerabilities in the
          backend. Never implement these patterns in a real application.
        </p>
      </Alert>

      <Row className="mb-4">
        <Col lg={6}>
          <Card className="mb-4 border-danger">
            <Card.Header className="bg-danger text-white">
              <h3>JWT Token Expiration Vulnerability</h3>
            </Card.Header>
            <Card.Body>
              <Alert variant="warning">
                <p>
                  <strong>Vulnerability:</strong> The backend doesn't validate
                  JWT token expiration times. This allows attackers to use
                  expired tokens indefinitely.
                </p>
                <pre className="bg-light p-2">
                  {`// Code commented out in the backend:
// if expirationTime.Before(time.Now()) {
//   return errorpkg.ErrInvalidBearerToken
// }`}
                </pre>
              </Alert>

              {exploitExpiredToken ? (
                <>
                  <Form.Group className="mb-3">
                    <Form.Label>Expired Access Token:</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      value={tokens.expiredAccess}
                      onChange={(e) =>
                        setTokens({ ...tokens, expiredAccess: e.target.value })
                      }
                      placeholder="Paste an expired JWT token"
                    />
                    <Form.Text className="text-muted">
                      This should be a JWT token that has already expired.
                    </Form.Text>
                  </Form.Group>

                  <Button
                    variant="danger"
                    onClick={handleExploitExpiredToken}
                    disabled={isLoading || !tokens.expiredAccess}>
                    {isLoading ? "Testing..." : "Test Expired Token"}
                  </Button>
                  <Button
                    variant="outline-secondary"
                    className="ms-2"
                    onClick={() => setExploitExpiredToken(false)}>
                    Cancel
                  </Button>
                </>
              ) : (
                <Button
                  variant="outline-danger"
                  onClick={() => setExploitExpiredToken(true)}>
                  Demonstrate Token Expiration Vulnerability
                </Button>
              )}
            </Card.Body>
          </Card>

          <Card className="border-danger">
            <Card.Header className="bg-danger text-white">
              <h3>Weak Random Number Generation</h3>
            </Card.Header>
            <Card.Body>
              <Alert variant="warning">
                <p>
                  <strong>Vulnerability:</strong> The backend uses math/rand
                  instead of crypto/rand for generating OTPs, making them
                  predictable.
                </p>
                <pre className="bg-light p-2">
                  {`// Vulnerable code in the backend:
func RandomNumber(digits int) int {
  low := int(math.Pow10(digits - 1))
  high := int(math.Pow10(digits)) - 1
  return low + rand.Intn(high-low+1)
}`}
                </pre>
              </Alert>

              <Button variant="danger" onClick={simulateWeakOTP}>
                Simulate Weak OTP Generation
              </Button>

              <div className="mt-3">
                <Link to="/reset-password">
                  <Button variant="outline-primary">
                    Try Password Reset Vulnerability
                  </Button>
                </Link>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={6}>
          <Card className="border-danger">
            <Card.Header className="bg-danger text-white">
              <h3>No Rate Limiting (Brute Force Vulnerability)</h3>
            </Card.Header>
            <Card.Body>
              <Alert variant="warning">
                <p>
                  <strong>Vulnerability:</strong> The backend has no rate
                  limiting on authentication endpoints, allowing unlimited login
                  attempts without any delay or blocking mechanism.
                </p>
              </Alert>

              {brute ? (
                <>
                  <Form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleBruteForceAttack();
                    }}>
                    <Form.Group className="mb-3">
                      <Form.Label>Target Email:</Form.Label>
                      <Form.Control
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter email to attack"
                        required
                      />
                      <Form.Text className="text-muted">
                        This will attempt to brute force the account using
                        common passwords.
                      </Form.Text>
                    </Form.Group>

                    <Button
                      variant="danger"
                      type="submit"
                      disabled={isLoading || !email}>
                      {isLoading ? "Attacking..." : "Start Brute Force Attack"}
                    </Button>
                    <Button
                      variant="outline-secondary"
                      className="ms-2"
                      onClick={() => setBrute(false)}>
                      Cancel
                    </Button>
                  </Form>

                  {bruteForceResults && (
                    <div className="mt-3">
                      <h5>
                        Attack Results:{" "}
                        <span
                          className={
                            bruteForceResults.success
                              ? "text-success"
                              : "text-danger"
                          }>
                          {bruteForceResults.success ? "SUCCESS" : "FAILED"}
                        </span>
                      </h5>
                      <ListGroup>
                        <ListGroup.Item>
                          Attempts: {bruteForceResults.attempts}
                        </ListGroup.Item>
                        {bruteForceResults.success && (
                          <ListGroup.Item className="text-success">
                            Found Password: {bruteForceResults.foundPassword}
                          </ListGroup.Item>
                        )}
                      </ListGroup>
                    </div>
                  )}
                </>
              ) : (
                <Button variant="outline-danger" onClick={() => setBrute(true)}>
                  Demonstrate Brute Force Vulnerability
                </Button>
              )}
            </Card.Body>
          </Card>

          <Card className="mt-4 border-danger">
            <Card.Header className="bg-danger text-white">
              <h3>Plaintext Password Storage</h3>
            </Card.Header>
            <Card.Body>
              <Alert variant="warning">
                <p>
                  <strong>Vulnerability:</strong> The backend bcrypt
                  implementation is commented out, causing passwords to be
                  stored as plaintext.
                </p>
                <pre className="bg-light p-2">
                  {`// Vulnerable code in the backend:
// newPasswordHash, err := s.bcrypt.Hash(newPassword)
// if err != nil {
//   // error handling
// }

// update user password
user.PasswordHash = newPassword // Stored as plaintext!`}
                </pre>
              </Alert>

              <p>
                To demonstrate this vulnerability, create a new account or reset
                a password. The password will be stored as plaintext in the
                database, making it immediately accessible if the database is
                compromised.
              </p>

              <div className="d-flex">
                <Link to="/register" className="me-2">
                  <Button variant="outline-danger">
                    Register (Plaintext Password)
                  </Button>
                </Link>
                <Link to="/reset-password">
                  <Button variant="outline-danger">
                    Reset Password (Plaintext)
                  </Button>
                </Link>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {error && (
        <Alert variant="danger" className="mt-3">
          {error}
        </Alert>
      )}

      {success && (
        <Alert variant="success" className="mt-3">
          {success}
        </Alert>
      )}

      <Card className="mt-4">
        <Card.Header className="bg-warning">
          <h3>Security Recommendations</h3>
        </Card.Header>
        <Card.Body>
          <h4>How to Fix These Vulnerabilities:</h4>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <strong>JWT Token Expiration:</strong> Uncomment and implement the
              token expiration check code in auth.go middleware.
            </ListGroup.Item>
            <ListGroup.Item>
              <strong>Rate Limiting:</strong> Implement rate limiting on
              authentication endpoints using a middleware that tracks login
              attempts and temporarily blocks IPs or accounts after multiple
              failures.
            </ListGroup.Item>
            <ListGroup.Item>
              <strong>Secure Random Generation:</strong> Replace math/rand with
              crypto/rand for all security-sensitive random number generation,
              especially for OTPs and tokens.
            </ListGroup.Item>
            <ListGroup.Item>
              <strong>Password Hashing:</strong> Uncomment and properly
              implement the bcrypt password hashing code to ensure passwords are
              never stored in plaintext.
            </ListGroup.Item>
          </ListGroup>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default AuthenticationVulnerabilities;
