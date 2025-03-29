"use client"

import { useState } from "react"
import { Container, Row, Col, Card, Badge, Button, Alert } from "react-bootstrap"
import { useParams, useNavigate, Link } from "react-router-dom"

const ProposalDetails = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  // Mock proposal data - in a real app, you would fetch this from an API
  const proposal = {
    id,
    title: "Building Scalable React Applications",
    category: "Frontend",
    status: "pending",
    submittedDate: "2023-05-15",
    description:
      "Learn best practices for building scalable React applications with proper architecture, state management, and performance optimization techniques.",
    objectives:
      "Understand React architecture patterns, learn state management best practices, implement performance optimization techniques.",
    prerequisites: "Basic knowledge of React and JavaScript.",
    duration: "60",
    maxAttendees: "30",
    feedback: "Your proposal is being reviewed by our committee. We will notify you once a decision has been made.",
  }

  const handleDelete = () => {
    // In a real app, you would make an API call to delete the proposal
    navigate("/my-proposals")
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge bg="warning">Pending Review</Badge>
      case "approved":
        return <Badge bg="success">Approved</Badge>
      case "rejected":
        return <Badge bg="danger">Rejected</Badge>
      default:
        return <Badge bg="secondary">Unknown</Badge>
    }
  }

  return (
    <Container className="py-4">
      <Row>
        <Col lg={8}>
          <Card className="mb-4">
            <Card.Header className="d-flex justify-content-between align-items-center">
              <div>
                <h4 className="mb-0">{proposal.title}</h4>
                <div className="mt-2">
                  <Badge bg="primary" className="me-2">
                    {proposal.category}
                  </Badge>
                  {getStatusBadge(proposal.status)}
                </div>
              </div>
            </Card.Header>
            <Card.Body>
              <div className="mb-4">
                <h5>Description</h5>
                <p>{proposal.description}</p>
              </div>

              <div className="mb-4">
                <h5>Learning Objectives</h5>
                <p>{proposal.objectives}</p>
              </div>

              <div className="mb-4">
                <h5>Prerequisites</h5>
                <p>{proposal.prerequisites || "None"}</p>
              </div>

              <Row className="mb-4">
                <Col md={6}>
                  <h5>Duration</h5>
                  <p>{proposal.duration} minutes</p>
                </Col>
                <Col md={6}>
                  <h5>Maximum Attendees</h5>
                  <p>{proposal.maxAttendees}</p>
                </Col>
              </Row>

              <div className="mb-4">
                <h5>Submission Date</h5>
                <p>{proposal.submittedDate}</p>
              </div>

              {proposal.feedback && (
                <div className="mb-4">
                  <h5>Feedback from Coordinators</h5>
                  <Alert variant="info">{proposal.feedback}</Alert>
                </div>
              )}
            </Card.Body>
            <Card.Footer>
              <div className="d-flex justify-content-between">
                <Button variant="secondary" onClick={() => navigate("/my-proposals")}>
                  Back to My Proposals
                </Button>
                <div>
                  {proposal.status === "pending" && (
                    <>
                      <Link to={`/edit-proposal/${proposal.id}`}>
                        <Button variant="primary" className="me-2">
                          Edit
                        </Button>
                      </Link>
                      {!showDeleteConfirm ? (
                        <Button variant="danger" onClick={() => setShowDeleteConfirm(true)}>
                          Delete
                        </Button>
                      ) : (
                        <Button variant="danger" onClick={handleDelete}>
                          Confirm Delete
                        </Button>
                      )}
                    </>
                  )}
                </div>
              </div>
            </Card.Footer>
          </Card>
        </Col>

        <Col lg={4}>
          <Card className="mb-4">
            <Card.Header>
              <h5 className="mb-0">Status</h5>
            </Card.Header>
            <Card.Body>
              <div className="text-center mb-3">{getStatusBadge(proposal.status)}</div>

              {proposal.status === "pending" && (
                <Alert variant="info">
                  Your proposal is currently under review. We will notify you once a decision has been made.
                </Alert>
              )}

              {proposal.status === "approved" && (
                <Alert variant="success">
                  Congratulations! Your proposal has been approved. You can now prepare for your session.
                </Alert>
              )}

              {proposal.status === "rejected" && (
                <Alert variant="danger">
                  Unfortunately, your proposal has been rejected. Please check the feedback for more information.
                </Alert>
              )}
            </Card.Body>
          </Card>

          <Card>
            <Card.Header>
              <h5 className="mb-0">Next Steps</h5>
            </Card.Header>
            <Card.Body>
              {proposal.status === "pending" && (
                <ul className="list-group list-group-flush">
                  <li className="list-group-item">Wait for the review process to complete</li>
                  <li className="list-group-item">You can edit your proposal while it's pending</li>
                  <li className="list-group-item">Check back for updates on your proposal status</li>
                </ul>
              )}

              {proposal.status === "approved" && (
                <ul className="list-group list-group-flush">
                  <li className="list-group-item">Prepare your session materials</li>
                  <li className="list-group-item">Check your session details and schedule</li>
                  <li className="list-group-item">Reach out to the coordinator if you have questions</li>
                </ul>
              )}

              {proposal.status === "rejected" && (
                <ul className="list-group list-group-flush">
                  <li className="list-group-item">Review the feedback provided</li>
                  <li className="list-group-item">Consider submitting a revised proposal</li>
                  <li className="list-group-item">Contact the coordinator for more information</li>
                </ul>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  )
}

export default ProposalDetails

