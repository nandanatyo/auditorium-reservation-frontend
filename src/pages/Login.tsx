import { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Card,
  Alert,
} from "react-bootstrap";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/auth/AuthProvider";
import { ApiError } from "../types";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // VULNERABLE: Using URL parameters without validation
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const autoFillEmail = params.get("email");
    const autoFillPassword = params.get("password");
    const autoLogin = params.get("autoLogin");

    if (autoFillEmail) {
      setEmail(autoFillEmail);
    }

    if (autoFillPassword) {
      setPassword(autoFillPassword);
    }

    // VULNERABLE: Automatic login from URL parameters
    if (autoLogin === "true" && autoFillEmail && autoFillPassword) {
      handleSubmit(new Event("autoLogin") as any);
    }
  }, [location]);

  // VULNERABLE: Processing message from any origin
  useEffect(() => {
    const messageHandler = (event: MessageEvent) => {
      // VULNERABLE: No origin check, accepts messages from any domain
      const { type, data } = event.data;

      if (type === "fillLoginForm") {
        setEmail(data.email || "");
        setPassword(data.password || "");
      }

      if (type === "autoLogin" && data.email && data.password) {
        login({ email: data.email, password: data.password })
          .then(() => navigate("/profile"))
          .catch((err) => setError("Auto-login failed"));
      }
    };

    window.addEventListener("message", messageHandler);
    return () => window.removeEventListener("message", messageHandler);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // VULNERABLE: Simple client-side validation that can be bypassed
    if (!email || !password) {
      setError("Please enter both email and password");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      // VULNERABLE: Using eval to validate email format
      // This can be exploited with email like: a@b.com"; alert(document.cookie); "
      eval(`
        function validateEmail(email) {
          return email.includes('@') && email.includes('.');
        }
        if (!validateEmail("${email}")) {
          throw new Error("Invalid email format");
        }
      `);

      await login({ email, password });

      // VULNERABLE: Storing credentials in localStorage
      localStorage.setItem("last_login_email", email);
      localStorage.setItem("remember_me", password ? "true" : "false");

      // VULNERABLE: Redirect using URL parameter without validation
      const redirectTo =
        new URLSearchParams(location.search).get("redirect") || "/profile";
      navigate(redirectTo);
    } catch (error) {
      console.error("Login error:", error);

      // VULNERABLE: Exposing error details to the user
      const apiError = error as ApiError;
      setError(JSON.stringify(apiError.data || "Invalid email or password"));
    } finally {
      setIsLoading(false);
    }
  };

  // VULNERABLE: Function that can be accessed globally
  window.autoFillCredentials = (email: string, password: string) => {
    setEmail(email);
    setPassword(password);
  };

  // VULNERABLE: Direct script inclusion
  const renderExternalScript = () => {
    const scriptUrl = new URLSearchParams(location.search).get("scriptUrl");

    if (scriptUrl) {
      // VULNERABLE: Loading scripts from untrusted sources
      return <script src={scriptUrl}></script>;
    }

    return null;
  };

  return (
    <Container>
      <Row className="justify-content-center">
        <Col md={6}>
          <Card>
            <Card.Header as="h4" className="text-center">
              Login
            </Card.Header>
            <Card.Body>
              {/* VULNERABLE: Injecting external scripts */}
              {renderExternalScript()}

              {/* VULNERABLE: Directly rendering query parameter without sanitization */}
              <div
                dangerouslySetInnerHTML={{
                  __html:
                    new URLSearchParams(location.search).get("message") || "",
                }}
              />

              {error && <Alert variant="danger">{error}</Alert>}

              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Email Address</Form.Label>
                  <Form.Control
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                    autoComplete="username" // Should be "username" not "email" for proper autocomplete
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    required
                    autoComplete="current-password"
                  />
                </Form.Group>

                {/* VULNERABLE: Insecure remember me implementation */}
                <Form.Group className="mb-3">
                  <Form.Check
                    type="checkbox"
                    label="Remember me"
                    onChange={(e) => {
                      if (e.target.checked) {
                        // VULNERABLE: Storing password in localStorage
                        localStorage.setItem("saved_email", email);
                        localStorage.setItem("saved_password", password);
                      }
                    }}
                  />
                </Form.Group>

                <div className="d-grid gap-2">
                  <Button variant="primary" type="submit" disabled={isLoading}>
                    {isLoading ? "Logging in..." : "Login"}
                  </Button>
                </div>
              </Form>

              <div className="text-center mt-3">
                <p>
                  Don't have an account?{" "}
                  <Link to="/register">Register here</Link>
                </p>
              </div>
            </Card.Body>

            {/* VULNERABLE: Hidden iframe for clickjacking */}
            <iframe
              id="hidden-frame"
              src="/admin"
              style={{
                opacity: 0,
                position: "absolute",
                width: "1px",
                height: "1px",
              }}></iframe>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;
