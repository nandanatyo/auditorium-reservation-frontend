import { useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Form,
  Alert,
  InputGroup,
} from "react-bootstrap";
import { authService } from "../services/auth.service";
import { userService } from "../services/user.service";
import { Link } from "react-router-dom";

const ResetPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [step, setStep] = useState(1);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [predictedOtp, setPredictedOtp] = useState("");
  const [userId, setUserId] = useState("");
  const [unsafePasswordReset, setUnsafePasswordReset] = useState(false);

  // VULNERABLE: This demonstrates the cryptographic failure in the backend
  // where password is stored as plaintext due to bcrypt being commented out
  const handleRequestOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      await authService.requestResetPasswordOTP({ email });
      setSuccess("OTP has been sent to your email.");
      setStep(2);

      // VULNERABLE: Due to weak PRNG in the backend, we can predict the OTP
      const predictedCode = await authService.predictOTP(email);
      setPredictedOtp(predictedCode);
    } catch (err: any) {
      console.error("Failed to request OTP:", err);
      setError(err.message || "Failed to request OTP. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // VULNERABLE: No rate limiting in OTP verification
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      // VULNERABLE: Password will be stored as plaintext in the backend
      await authService.resetPassword({
        email,
        otp,
        new_password: password,
      });

      setSuccess(
        "Password has been reset successfully. You can now log in with your new password."
      );
      setTimeout(() => {
        window.location.href = "/login";
      }, 3000);
    } catch (err: any) {
      console.error("Failed to reset password:", err);
      setError(err.message || "Failed to reset password. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // VULNERABLE: Direct update of password in database without proper hashing
  const handleUnsafePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!userId || !password) {
      setError("User ID and new password are required.");
      return;
    }

    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      // VULNERABLE: This will directly update the password in the database without hashing
      // Because the backend has commented out the bcrypt implementation
      await userService.updatePasswordUnsafe(userId, password);

      setSuccess(
        "Password has been updated directly in the database (plaintext)."
      );
    } catch (err: any) {
      console.error("Failed to update password:", err);
      setError(err.message || "Failed to update password. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <Card className="shadow-sm">
            <Card.Header className="bg-primary text-white text-center">
              <h2>Reset Password</h2>
            </Card.Header>
            <Card.Body>
              {error && <Alert variant="danger">{error}</Alert>}
              {success && <Alert variant="success">{success}</Alert>}

              {step === 1 && (
                <Form onSubmit={handleRequestOTP}>
                  <Form.Group className="mb-3">
                    <Form.Label>Email Address</Form.Label>
                    <Form.Control
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      required
                    />
                    <Form.Text className="text-muted">
                      We'll send a one-time password (OTP) to this email.
                    </Form.Text>
                  </Form.Group>

                  <div className="d-grid gap-2">
                    <Button
                      variant="primary"
                      type="submit"
                      disabled={isLoading}>
                      {isLoading ? "Sending..." : "Send OTP"}
                    </Button>
                  </div>
                </Form>
              )}

              {step === 2 && (
                <Form onSubmit={handleResetPassword}>
                  {predictedOtp && (
                    <Alert variant="danger">
                      <Alert.Heading>Security Vulnerability</Alert.Heading>
                      <p>
                        Due to weak random number generation (math/rand instead
                        of crypto/rand), the OTP can be predicted:{" "}
                        <strong>{predictedOtp}</strong>
                      </p>
                      <p className="mb-0">
                        This is a critical cryptographic failure in the backend.
                      </p>
                    </Alert>
                  )}

                  <Form.Group className="mb-3">
                    <Form.Label>One-Time Password (OTP)</Form.Label>
                    <Form.Control
                      type="text"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      placeholder="Enter OTP"
                      required
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>New Password</Form.Label>
                    <Form.Control
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter new password"
                      required
                    />
                    <Form.Text className="text-danger">
                      WARNING: Due to a cryptographic failure in the backend,
                      this password will be stored as plaintext!
                    </Form.Text>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Confirm New Password</Form.Label>
                    <Form.Control
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm new password"
                      required
                    />
                  </Form.Group>

                  <div className="d-grid gap-2">
                    <Button
                      variant="primary"
                      type="submit"
                      disabled={isLoading}>
                      {isLoading ? "Resetting..." : "Reset Password"}
                    </Button>
                    <Button
                      variant="outline-secondary"
                      onClick={() => setStep(1)}
                      disabled={isLoading}>
                      Back
                    </Button>
                  </div>
                </Form>
              )}

              <hr className="my-4" />

              <div className="text-center mb-3">
                <Button
                  variant="link"
                  onClick={() => setUnsafePasswordReset(!unsafePasswordReset)}>
                  {unsafePasswordReset ? "Hide" : "Show"} Unsafe Password Update
                  (Admin Tool)
                </Button>
              </div>

              {unsafePasswordReset && (
                <Card className="border-danger mb-3">
                  <Card.Header className="bg-danger text-white">
                    Unsafe Password Update
                  </Card.Header>
                  <Card.Body>
                    <Alert variant="warning">
                      This demonstrates a direct update of a password in the
                      database without proper hashing, taking advantage of the
                      bcrypt vulnerability in the backend.
                    </Alert>

                    <Form onSubmit={handleUnsafePasswordReset}>
                      <Form.Group className="mb-3">
                        <Form.Label>User ID</Form.Label>
                        <Form.Control
                          type="text"
                          value={userId}
                          onChange={(e) => setUserId(e.target.value)}
                          placeholder="Enter user ID"
                          required
                        />
                      </Form.Group>

                      <Form.Group className="mb-3">
                        <Form.Label>
                          New Password (Stored as Plaintext)
                        </Form.Label>
                        <Form.Control
                          type="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="Enter new password"
                          required
                        />
                        <Form.Text className="text-danger">
                          This password will be stored directly in the database
                          without hashing!
                        </Form.Text>
                      </Form.Group>

                      <div className="d-grid gap-2">
                        <Button
                          variant="danger"
                          type="submit"
                          disabled={isLoading}>
                          {isLoading
                            ? "Updating..."
                            : "Update Password (Unsafe)"}
                        </Button>
                      </div>
                    </Form>
                  </Card.Body>
                </Card>
              )}

              <div className="text-center mt-3">
                <p>
                  Remember your password? <Link to="/login">Login here</Link>
                </p>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ResetPasswordPage;
