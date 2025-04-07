import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Badge,
  Form,
  Alert,
  ListGroup,
  Spinner,
} from "react-bootstrap";
import { useAuth } from "../contexts/auth/AuthProvider";
import { useRegistration } from "../contexts/registration/RegistrationProvider";
import { conferenceService } from "../services/conference.service";
import { feedbackService } from "../services/feedback.service";
import { Conference, Feedback } from "../types";

const SessionDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { registerForConference, isLoading: isRegistrationLoading } =
    useRegistration();

  const [conference, setConference] = useState<Conference | null>(null);
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRegistering, setIsRegistering] = useState(false);
  const [isLoadingFeedback, setIsLoadingFeedback] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const [feedbackForm, setFeedbackForm] = useState({ comment: "" });
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");


  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };


  useEffect(() => {
    if (!id) return;

    const loadData = async () => {
      try {
        setIsLoading(true);


        const conferenceData = await conferenceService.getConference(id);
        setConference(conferenceData);


        try {
          setIsLoadingFeedback(true);
          const feedbackResponse = await feedbackService.getConferenceFeedbacks(
            id,
            { limit: 10 }
          );
          setFeedbacks(feedbackResponse.feedbacks || []);
        } catch (feedbackErr) {
          console.error("Error loading feedbacks:", feedbackErr);

        } finally {
          setIsLoadingFeedback(false);
        }

        setError("");
      } catch (err: any) {
        console.error("Error loading session details:", err);
        setError(err.message || "Failed to load session details");
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [id]);


  const handleRegister = async () => {
    if (!user) {
      navigate("/login");
      return;
    }

    if (!conference || !id) return;

    try {
      setIsRegistering(true);
      setError("");


      await registerForConference({ conference_id: id });


      setIsRegistered(true);
      setSuccessMessage("You have successfully registered for this session!");


      try {
        const updatedConference = await conferenceService.getConference(id);
        setConference(updatedConference);
      } catch (refreshErr) {
        console.error("Failed to refresh conference data:", refreshErr);
      }


      setTimeout(() => {
        setSuccessMessage("");
      }, 5000);
    } catch (err: any) {
      console.error("Failed to register for conference:", err);
      setError(err.message || "Failed to register for this conference");
    } finally {
      setIsRegistering(false);
    }
  };


  const handleFeedbackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      navigate("/login");
      return;
    }

    if (!conference || !id) return;

    try {
      setIsLoadingFeedback(true);
      setError("");


      await feedbackService.createFeedback({
        conference_id: id,
        comment: feedbackForm.comment,
      });


      setFeedbackSubmitted(true);
      setShowFeedbackForm(false);
      setFeedbackForm({ comment: "" });

      const updatedFeedbacksResponse =
        await feedbackService.getConferenceFeedbacks(id, {
          limit: 10,
        });
      setFeedbacks(updatedFeedbacksResponse.feedbacks || []);

      setTimeout(() => {
        setFeedbackSubmitted(false);
      }, 3000);
    } catch (err: any) {
      console.error("Failed to submit feedback:", err);
      setError(err.message || "Failed to submit feedback");
    } finally {
      setIsLoadingFeedback(false);
    }
  };

  const handleFeedbackChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFeedbackForm((prev) => ({ ...prev, [name]: value }));
  };

  if (isLoading) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading session details...</span>
        </Spinner>
      </div>
    );
  }

  if (error) {
    return (
      <Container className="py-4">
        <Alert variant="danger">
          <Alert.Heading>Error</Alert.Heading>
          <p>{error}</p>
          <div className="d-flex justify-content-end">
            <Button onClick={() => navigate(-1)} variant="outline-danger">
              Go Back
            </Button>
          </div>
        </Alert>
      </Container>
    );
  }

  if (!conference) {
    return (
      <Container className="py-4">
        <Alert variant="warning">
          <Alert.Heading>Conference Not Found</Alert.Heading>
          <p>
            The session you're looking for doesn't exist or you may not have
            permission to view it.
          </p>
          <div className="d-flex justify-content-end">
            <Button onClick={() => navigate(-1)} variant="outline-warning">
              Go Back
            </Button>
          </div>
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      {successMessage && (
        <Alert
          variant="success"
          dismissible
          onClose={() => setSuccessMessage("")}>
          {successMessage}
        </Alert>
      )}

      <Row>
        <Col lg={8}>
          <Card className="mb-4">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-start mb-3">
                <div>
                  <h1>{conference.title}</h1>
                  <h5 className="text-muted">by {conference.speaker_name}</h5>
                </div>
                <Badge
                  bg={
                    conference.status === "approved"
                      ? "success"
                      : conference.status === "pending"
                      ? "warning"
                      : "danger"
                  }
                  className="p-2">
                  {conference.status.charAt(0).toUpperCase() +
                    conference.status.slice(1)}
                </Badge>
              </div>

              <hr />

              <h5>Description</h5>
              <p>{conference.description}</p>

              <hr />

              <Row>
                <Col md={6}>
                  <h5>Session Details</h5>
                  <p>
                    <strong>Date:</strong> {formatDate(conference.starts_at)}
                  </p>
                  <p>
                    <strong>Time:</strong>{" "}
                    {new Date(conference.starts_at).toLocaleTimeString()} -{" "}
                    {new Date(conference.ends_at).toLocaleTimeString()}
                  </p>
                  <p>
                    <strong>Speaker Title:</strong> {conference.speaker_title}
                  </p>
                  {conference.prerequisites && (
                    <p>
                      <strong>Prerequisites:</strong> {conference.prerequisites}
                    </p>
                  )}
                </Col>
                <Col md={6}>
                  <h5>Attendance</h5>
                  <p>
                    <strong>Target Audience:</strong>{" "}
                    {conference.target_audience}
                  </p>
                  <p>
                    <strong>Current Attendees:</strong>{" "}
                    {conference.seats_taken || 0}
                  </p>
                  <p>
                    <strong>Maximum Capacity:</strong> {conference.seats}
                  </p>
                  <div className="progress mb-3">
                    <div
                      className="progress-bar"
                      role="progressbar"
                      style={{
                        width: `${
                          ((conference.seats_taken || 0) / conference.seats) *
                          100
                        }%`,
                      }}
                      aria-valuenow={
                        ((conference.seats_taken || 0) / conference.seats) * 100
                      }
                      aria-valuemin={0}
                      aria-valuemax={100}>
                      {Math.round(
                        ((conference.seats_taken || 0) / conference.seats) * 100
                      )}
                      %
                    </div>
                  </div>
                </Col>
              </Row>
            </Card.Body>
            <Card.Footer>
              {!isRegistered &&
              (conference.seats_taken || 0) < conference.seats &&
              conference.status === "approved" ? (
                <Button
                  variant="primary"
                  onClick={handleRegister}
                  disabled={
                    isRegistering ||
                    isRegistrationLoading ||
                    (conference.seats_taken || 0) >= conference.seats
                  }>
                  {isRegistering || isRegistrationLoading
                    ? "Registering..."
                    : "Register for this Session"}
                </Button>
              ) : isRegistered ? (
                <div>
                  <Button variant="outline-success" disabled>
                    Registered ✓
                  </Button>
                  <Link to="/my-sessions" className="ms-2">
                    <Button variant="link">View My Sessions</Button>
                  </Link>
                </div>
              ) : conference.status !== "approved" ? (
                <Button variant="secondary" disabled>
                  Registration Not Available - Session {conference.status}
                </Button>
              ) : (
                <Button variant="secondary" disabled>
                  Session is Full
                </Button>
              )}
              <Button
                variant="secondary"
                className="ms-2"
                onClick={() => navigate(-1)}>
                Back
              </Button>
            </Card.Footer>
          </Card>

          <Card>
            <Card.Header className="d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Feedback ({feedbacks.length})</h5>
              {user && !showFeedbackForm && (
                <Button
                  variant="outline-primary"
                  size="sm"
                  onClick={() => setShowFeedbackForm(true)}>
                  Leave Feedback
                </Button>
              )}
            </Card.Header>
            <Card.Body>
              {feedbackSubmitted && (
                <Alert variant="success">
                  Your feedback has been submitted successfully!
                </Alert>
              )}
              {error && <Alert variant="danger">{error}</Alert>}

              {showFeedbackForm && (
                <Form onSubmit={handleFeedbackSubmit} className="mb-4">
                  <Form.Group className="mb-3">
                    <Form.Label>Your Feedback</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      name="comment"
                      value={feedbackForm.comment}
                      onChange={handleFeedbackChange}
                      placeholder="Share your thoughts about this session..."
                      required
                    />
                  </Form.Group>

                  <div className="d-flex justify-content-end gap-2">
                    <Button
                      variant="secondary"
                      onClick={() => setShowFeedbackForm(false)}>
                      Cancel
                    </Button>
                    <Button
                      variant="primary"
                      type="submit"
                      disabled={isLoadingFeedback}>
                      {isLoadingFeedback ? "Submitting..." : "Submit Feedback"}
                    </Button>
                  </div>
                </Form>
              )}

              {isLoadingFeedback ? (
                <div className="text-center py-4">
                  <Spinner animation="border" size="sm" /> Loading feedbacks...
                </div>
              ) : feedbacks.length === 0 ? (
                <p className="text-center text-muted">
                  No feedback yet. Be the first to leave feedback!
                </p>
              ) : (
                <ListGroup variant="flush">
                  {feedbacks.map((feedback) => (
                    <ListGroup.Item key={feedback.id} className="border-bottom">
                      <div className="d-flex justify-content-between align-items-center mb-1">
                        <div>
                          <Link to={`/users/${feedback.user.id}`}>
                            {feedback.user.name}
                          </Link>
                        </div>
                        <small className="text-muted">
                          {formatDate(feedback.created_at)}
                        </small>
                      </div>
                      <p className="mb-0">{feedback.comment}</p>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
            </Card.Body>
          </Card>
        </Col>

        <Col lg={4}>
          <Card className="mb-4">
            <Card.Header>
              <h5 className="mb-0">Host</h5>
            </Card.Header>
            <Card.Body className="text-center">
              <img
                src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                  conference.host.name
                )}&background=random&size=128`}
                alt={conference.host.name}
                className="rounded-circle mb-3"
                style={{ width: "100px", height: "100px" }}
              />
              <h5>{conference.host.name}</h5>
              <Link to={`/users/${conference.host.id}`}>
                <Button variant="outline-primary" size="sm">
                  View Profile
                </Button>
              </Link>
            </Card.Body>
          </Card>

          {conference.status === "approved" && (
            <Card>
              <Card.Header>
                <h5 className="mb-0">Quick Actions</h5>
              </Card.Header>
              <Card.Body>
                <div className="d-grid gap-2">
                  <Link to="/my-sessions">
                    <Button variant="outline-secondary" className="w-100">
                      My Registered Sessions
                    </Button>
                  </Link>
                  <Link to="/sessions">
                    <Button variant="outline-secondary" className="w-100">
                      Browse All Sessions
                    </Button>
                  </Link>
                </div>
              </Card.Body>
            </Card>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default SessionDetails;
