// UserProfile.tsx - Modified to exploit Broken Access Control vulnerability
import { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Alert,
  Button,
  Form,
} from "react-bootstrap";
import { useParams } from "react-router-dom";
import { userService } from "../services/user.service";
import { registrationService } from "../services/registration.service";
import { UserMinimal, Conference, ApiError } from "../types";

const UserProfile = () => {
  const { id } = useParams<{ id: string }>();
  const [user, setUser] = useState<UserMinimal | null>(null);
  const [sessions, setSessions] = useState<Conference[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [userIdToFetch, setUserIdToFetch] = useState("");

  useEffect(() => {
    if (!id) return;

    const fetchUserData = async () => {
      setIsLoading(true);
      setError("");

      try {
        const userData = await userService.getUserById(id);
        setUser(userData);

        const registrationsResponse =
          await registrationService.getRegisteredConferences(id, {
            limit: 10,
            include_past: true,
          });
        setSessions(registrationsResponse.conferences);
      } catch (err) {
        console.error("Failed to load user profile:", err);
        const apiError = err as ApiError;
        setError(
          apiError.data?.message ||
            "Failed to load user profile. Please try again."
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [id]);

  // VULNERABLE: Exploits Broken Access Control on backend
  // Allows viewing any user by ID without proper authorization checks
  const fetchAnyUser = async () => {
    if (!userIdToFetch.trim()) {
      setError("Please enter a user ID");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      // Directly calls the API to fetch any user by ID
      // Backend should restrict this to authorized users or self
      const userData = await userService.getUserById(userIdToFetch);
      setUser(userData);

      // Also try to get their conferences
      try {
        const registrationsResponse =
          await registrationService.getRegisteredConferences(userIdToFetch, {
            limit: 10,
            include_past: true,
          });
        setSessions(registrationsResponse.conferences);
      } catch (err) {
        console.error("Failed to load user's conferences:", err);
      }
    } catch (err) {
      console.error("Failed to load user profile:", err);
      const apiError = err as ApiError;
      setError(
        apiError.data?.message ||
          "Failed to load user profile. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  // VULNERABLE: Exploits admin functionality without proper role checking
  const makeUserAdmin = async () => {
    if (!id) return;

    try {
      // This would normally be restricted to admin users only
      // But if the backend doesn't check roles properly, it might work
      await userService.updateUserRole(id, "admin");
      alert("User role updated to admin!");

      // Refresh user data
      const userData = await userService.getUserById(id);
      setUser(userData);
    } catch (err) {
      console.error("Failed to update user role:", err);
    }
  };

  if (isLoading && !user) {
    return <div className="text-center py-4">Loading profile...</div>;
  }

  return (
    <Container className="py-4">
      {/* VULNERABLE: Interface for exploiting Broken Access Control */}
      <Card className="mb-4 border-danger">
        <Card.Header className="bg-danger text-white">
          User ID Access Tool (Normally Admin Only)
        </Card.Header>
        <Card.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Enter User ID to View:</Form.Label>
              <Form.Control
                type="text"
                value={userIdToFetch}
                onChange={(e) => setUserIdToFetch(e.target.value)}
                placeholder="Enter user ID"
              />
              <Form.Text className="text-muted">
                This demonstrates a Broken Access Control vulnerability. The
                backend should check if you have permission to view this user.
              </Form.Text>
            </Form.Group>
            <Button variant="danger" onClick={fetchAnyUser}>
              Fetch User Profile
            </Button>

            {user && (
              <Button
                variant="warning"
                className="ms-2"
                onClick={makeUserAdmin}>
                Grant Admin Rights
              </Button>
            )}
          </Form>
        </Card.Body>
      </Card>

      {error && <Alert variant="danger">{error}</Alert>}

      {user && (
        <Row>
          <Col md={4}>
            <Card className="mb-4">
              <Card.Body className="text-center">
                <img
                  src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                    user.name || "User"
                  )}&background=random&size=128`}
                  alt={user.name || "User"}
                  className="rounded-circle mb-3"
                  style={{ width: "150px", height: "150px" }}
                />
                <Card.Title>{user.name || "User"}</Card.Title>
                <Card.Subtitle className="mb-2 text-muted">
                  {user.role &&
                    user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                </Card.Subtitle>
              </Card.Body>
            </Card>
          </Col>

          <Col md={8}>
            <Card className="mb-4">
              <Card.Header>Profile Information</Card.Header>
              <Card.Body>
                <h5>About</h5>
                <p>{user.bio || "No bio provided."}</p>

                <h5 className="mt-4">Sessions</h5>
                {sessions.length > 0 ? (
                  <ul className="list-group">
                    {sessions.map((session) => (
                      <li key={session.id} className="list-group-item">
                        {session.title}
                        <span className="badge bg-primary float-end">
                          {new Date(session.starts_at).toLocaleDateString()}
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-muted">No sessions found.</p>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}
    </Container>
  );
};

export default UserProfile;
