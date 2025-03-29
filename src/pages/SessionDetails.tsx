"use client"

import type React from "react"

import { useState, useContext } from "react"
import { Container, Row, Col, Card, Button, Badge, Form, Alert, ListGroup } from "react-bootstrap"
import { Link, useParams, useNavigate } from "react-router-dom"
import { UserContext } from "../context/UserContext"

// Mock data for a single session
const mockSession = {
  id: "1",
  title: "Introduction to React Hooks",
  speaker: "Jane Smith",
  speakerId: "2",
  date: "2023-06-15",
  time: "10:00 AM - 11:30 AM",
  location: "Room A",
  category: "Frontend",
  description:
    "Learn how to use React Hooks to simplify your components and manage state effectively. This session will cover useState, useEffect, useContext, and custom hooks. We will also discuss best practices and common pitfalls when using hooks in your React applications.",
  attendees: 45,
  maxAttendees: 50,
  isRegistered: false,
  feedback: [
    {
      id: "1",
      userId: "3",
      userName: "John Doe",
      rating: 5,
      comment: "Excellent session! The examples were very helpful.",
      date: "2023-05-20",
    },
    {
      id: "2",
      userId: "4",
      userName: "Sarah Williams",
      rating: 4,
      comment: "Great content, but could use more advanced examples.",
      date: "2023-05-21",
    },
  ],
}

const SessionDetails = () => {
  const { id } = useParams<{ id: string }>()
  const { user } = useContext(UserContext)
  const navigate = useNavigate()
  const [session, setSession] = useState(mockSession)
  const [isRegistered, setIsRegistered] = useState(false)
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false)
  const [feedbackForm, setFeedbackForm] = useState({ rating: 5, comment: "" })
  const [showFeedbackForm, setShowFeedbackForm] = useState(false)

//   useEffect(() => {
//     // Fetch session data
//   }, [id]);

  const handleRegister = () => {
    if (!user) {
      navigate("/login")
      return
    }

    // In a real app, you would make an API call to register the user
    setIsRegistered(true)
    setSession((prev) => ({
      ...prev,
      attendees: prev.attendees + 1,
      isRegistered: true,
    }))
  }

  const handleCancelRegistration = () => {
    // In a real app, you would make an API call to cancel the registration
    setIsRegistered(false)
    setSession((prev) => ({
      ...prev,
      attendees: prev.attendees - 1,
      isRegistered: false,
    }))
  }

  const handleFeedbackChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFeedbackForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleFeedbackSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!user) {
      navigate("/login")
      return
    }

    // In a real app, you would make an API call to submit the feedback
    const newFeedback = {
      id: Math.random().toString(),
      userId: user.id,
      userName: user.name,
      rating: Number.parseInt(feedbackForm.rating.toString()),
      comment: feedbackForm.comment,
      date: new Date().toISOString().split("T")[0],
    }

    setSession((prev) => ({
      ...prev,
      feedback: [newFeedback, ...prev.feedback],
    }))

    setFeedbackSubmitted(true)
    setShowFeedbackForm(false)
    setFeedbackForm({ rating: 5, comment: "" })

    // Reset the feedback submitted message after 3 seconds
    setTimeout(() => {
      setFeedbackSubmitted(false)
    }, 3000)
  }

  return (
    <Container>
      <Row>
        <Col lg={8}>
          <Card className="mb-4">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-start mb-3">
                <div>
                  <h1>{session.title}</h1>
                  <h5 className="text-muted">
                    by <Link to={`/users/${session.speakerId}`}>{session.speaker}</Link>
                  </h5>
                </div>
                <Badge bg="primary" className="p-2">
                  {session.category}
                </Badge>
              </div>

              <hr />

              <h5>Description</h5>
              <p>{session.description}</p>

              <hr />

              <Row>
                <Col md={6}>
                  <h5>Session Details</h5>
                  <p>
                    <strong>Date:</strong> {session.date}
                  </p>
                  <p>
                    <strong>Time:</strong> {session.time}
                  </p>
                  <p>
                    <strong>Location:</strong> {session.location}
                  </p>
                </Col>
                <Col md={6}>
                  <h5>Attendance</h5>
                  <p>
                    <strong>Current Attendees:</strong> {session.attendees}
                  </p>
                  <p>
                    <strong>Maximum Capacity:</strong> {session.maxAttendees}
                  </p>
                  <div className="progress mb-3">
                    <div
                      className="progress-bar"
                      role="progressbar"
                      style={{ width: `${(session.attendees / session.maxAttendees) * 100}%` }}
                      aria-valuenow={(session.attendees / session.maxAttendees) * 100}
                      aria-valuemin={0}
                      aria-valuemax={100}
                    >
                      {Math.round((session.attendees / session.maxAttendees) * 100)}%
                    </div>
                  </div>
                </Col>
              </Row>
            </Card.Body>
            <Card.Footer>
              {!isRegistered && session.attendees < session.maxAttendees ? (
                <Button variant="primary" onClick={handleRegister} disabled={session.attendees >= session.maxAttendees}>
                  Register for this Session
                </Button>
              ) : isRegistered ? (
                <Button variant="outline-danger" onClick={handleCancelRegistration}>
                  Cancel Registration
                </Button>
              ) : (
                <Button variant="secondary" disabled>
                  Session is Full
                </Button>
              )}
            </Card.Footer>
          </Card>

          <Card>
            <Card.Header className="d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Feedback ({session.feedback.length})</h5>
              {user && !showFeedbackForm && (
                <Button variant="outline-primary" size="sm" onClick={() => setShowFeedbackForm(true)}>
                  Leave Feedback
                </Button>
              )}
            </Card.Header>
            <Card.Body>
              {feedbackSubmitted && <Alert variant="success">Your feedback has been submitted successfully!</Alert>}

              {showFeedbackForm && (
                <Form onSubmit={handleFeedbackSubmit} className="mb-4">
                  <Form.Group className="mb-3">
                    <Form.Label>Rating</Form.Label>
                    <Form.Select
                      name="rating"
                      value={feedbackForm.rating}
                      onChange={(e) => handleFeedbackChange(e as any)}
                    >
                      <option value="5">5 - Excellent</option>
                      <option value="4">4 - Very Good</option>
                      <option value="3">3 - Good</option>
                      <option value="2">2 - Fair</option>
                      <option value="1">1 - Poor</option>
                    </Form.Select>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Comment</Form.Label>
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
                    <Button variant="secondary" onClick={() => setShowFeedbackForm(false)}>
                      Cancel
                    </Button>
                    <Button variant="primary" type="submit">
                      Submit Feedback
                    </Button>
                  </div>
                </Form>
              )}

              {session.feedback.length === 0 ? (
                <p className="text-center text-muted">No feedback yet. Be the first to leave feedback!</p>
              ) : (
                <ListGroup variant="flush">
                  {session.feedback.map((item) => (
                    <ListGroup.Item key={item.id} className="border-bottom">
                      <div className="d-flex justify-content-between align-items-center mb-1">
                        <div>
                          <Link to={`/users/${item.userId}`}>{item.userName}</Link>
                          <span className="text-muted ms-2">
                            {Array(item.rating).fill("★").join("")}
                            {Array(5 - item.rating)
                              .fill("☆")
                              .join("")}
                          </span>
                        </div>
                        <small className="text-muted">{item.date}</small>
                      </div>
                      <p className="mb-0">{item.comment}</p>
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
              <h5 className="mb-0">Speaker</h5>
            </Card.Header>
            <Card.Body className="text-center">
              <img
                src={`https://ui-avatars.com/api/?name=${encodeURIComponent(session.speaker)}&background=random&size=128`}
                alt={session.speaker}
                className="rounded-circle mb-3"
                style={{ width: "100px", height: "100px" }}
              />
              <h5>{session.speaker}</h5>
              <p className="text-muted">Speaker Bio</p>
              <Link to={`/users/${session.speakerId}`}>
                <Button variant="outline-primary" size="sm">
                  View Profile
                </Button>
              </Link>
            </Card.Body>
          </Card>

          <Card>
            <Card.Header>
              <h5 className="mb-0">Related Sessions</h5>
            </Card.Header>
            <ListGroup variant="flush">
              <ListGroup.Item action as={Link} to="/sessions/2">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <strong>Advanced TypeScript Patterns</strong>
                    <div className="text-muted small">John Doe</div>
                  </div>
                  <Badge bg="primary">Programming</Badge>
                </div>
              </ListGroup.Item>
              <ListGroup.Item action as={Link} to="/sessions/3">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <strong>Building Scalable APIs with Node.js</strong>
                    <div className="text-muted small">Alex Johnson</div>
                  </div>
                  <Badge bg="primary">Backend</Badge>
                </div>
              </ListGroup.Item>
              <ListGroup.Item action as={Link} to="/sessions/4">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <strong>UI/UX Design Principles</strong>
                    <div className="text-muted small">Sarah Williams</div>
                  </div>
                  <Badge bg="primary">Design</Badge>
                </div>
              </ListGroup.Item>
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </Container>
  )
}

export default SessionDetails

