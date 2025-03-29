"use client"

import { useState } from "react"
import { Container, Card, Table, Badge, Button, Tabs, Tab, Alert } from "react-bootstrap"
import { Link } from "react-router-dom"

const CoordinatorDashboard = () => {
  const [key, setKey] = useState("proposals")
  const [proposals, setProposals] = useState([
    {
      id: "1",
      title: "Building Scalable React Applications",
      speaker: "John Doe",
      category: "Frontend",
      status: "pending",
      submittedDate: "2023-05-15",
    },
    {
      id: "2",
      title: "Introduction to GraphQL",
      speaker: "Jane Smith",
      category: "Backend",
      status: "pending",
      submittedDate: "2023-05-10",
    },
    {
      id: "3",
      title: "Microservices with Node.js",
      speaker: "Alex Johnson",
      category: "Architecture",
      status: "pending",
      submittedDate: "2023-05-05",
    },
  ])

  const [sessions, setSessions] = useState([
    {
      id: "1",
      title: "Advanced TypeScript Patterns",
      speaker: "Sarah Williams",
      date: "2023-06-15",
      time: "10:00 AM - 11:30 AM",
      location: "Room A",
      attendees: 25,
      maxAttendees: 30,
    },
    {
      id: "2",
      title: "UI/UX Design Principles",
      speaker: "Michael Brown",
      date: "2023-06-16",
      time: "2:00 PM - 3:30 PM",
      location: "Room B",
      attendees: 35,
      maxAttendees: 40,
    },
  ])

  const [feedback, setFeedback] = useState([
    {
      id: "1",
      sessionId: "1",
      sessionTitle: "Advanced TypeScript Patterns",
      userId: "3",
      userName: "John Doe",
      rating: 4,
      comment: "Great session, learned a lot!",
      date: "2023-05-20",
      flagged: false,
    },
    {
      id: "2",
      sessionId: "1",
      sessionTitle: "Advanced TypeScript Patterns",
      userId: "4",
      userName: "Sarah Williams",
      rating: 2,
      comment: "Too advanced for beginners.",
      date: "2023-05-21",
      flagged: true,
    },
    {
      id: "3",
      sessionId: "2",
      sessionTitle: "UI/UX Design Principles",
      userId: "5",
      userName: "Michael Brown",
      rating: 5,
      comment: "Excellent content and presentation!",
      date: "2023-05-22",
      flagged: false,
    },
  ])

  const handleApproveProposal = (id: string) => {
    setProposals(proposals.map((proposal) => (proposal.id === id ? { ...proposal, status: "approved" } : proposal)))
  }

  const handleRejectProposal = (id: string) => {
    setProposals(proposals.map((proposal) => (proposal.id === id ? { ...proposal, status: "rejected" } : proposal)))
  }

  const handleRemoveSession = (id: string) => {
    setSessions(sessions.filter((session) => session.id !== id))
  }

  const handleRemoveFeedback = (id: string) => {
    setFeedback(feedback.filter((item) => item.id !== id))
  }

  const handleToggleFlagFeedback = (id: string) => {
    setFeedback(feedback.map((item) => (item.id === id ? { ...item, flagged: !item.flagged } : item)))
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge bg="warning">Pending</Badge>
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
      <h1 className="mb-4">Coordinator Dashboard</h1>

      <Tabs id="coordinator-tabs" activeKey={key} onSelect={(k) => setKey(k || "proposals")} className="mb-4">
        <Tab eventKey="proposals" title="Session Proposals">
          <Card>
            <Card.Header>
              <h5 className="mb-0">Session Proposals</h5>
            </Card.Header>
            <Card.Body>
              {proposals.length === 0 ? (
                <Alert variant="info">No pending proposals to review.</Alert>
              ) : (
                <Table responsive>
                  <thead>
                    <tr>
                      <th>Title</th>
                      <th>Speaker</th>
                      <th>Category</th>
                      <th>Submitted</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {proposals.map((proposal) => (
                      <tr key={proposal.id}>
                        <td>{proposal.title}</td>
                        <td>{proposal.speaker}</td>
                        <td>{proposal.category}</td>
                        <td>{proposal.submittedDate}</td>
                        <td>{getStatusBadge(proposal.status)}</td>
                        <td>
                          {proposal.status === "pending" && (
                            <div className="d-flex gap-2">
                              <Button variant="success" size="sm" onClick={() => handleApproveProposal(proposal.id)}>
                                Approve
                              </Button>
                              <Button variant="danger" size="sm" onClick={() => handleRejectProposal(proposal.id)}>
                                Reject
                              </Button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
            </Card.Body>
          </Card>
        </Tab>

        <Tab eventKey="sessions" title="Active Sessions">
          <Card>
            <Card.Header>
              <h5 className="mb-0">Active Sessions</h5>
            </Card.Header>
            <Card.Body>
              {sessions.length === 0 ? (
                <Alert variant="info">No active sessions found.</Alert>
              ) : (
                <Table responsive>
                  <thead>
                    <tr>
                      <th>Title</th>
                      <th>Speaker</th>
                      <th>Date</th>
                      <th>Time</th>
                      <th>Location</th>
                      <th>Attendees</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sessions.map((session) => (
                      <tr key={session.id}>
                        <td>{session.title}</td>
                        <td>{session.speaker}</td>
                        <td>{session.date}</td>
                        <td>{session.time}</td>
                        <td>{session.location}</td>
                        <td>
                          {session.attendees}/{session.maxAttendees}
                        </td>
                        <td>
                          <div className="d-flex gap-2">
                            <Link to={`/sessions/${session.id}`}>
                              <Button variant="primary" size="sm">
                                View
                              </Button>
                            </Link>
                            <Button variant="danger" size="sm" onClick={() => handleRemoveSession(session.id)}>
                              Remove
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
            </Card.Body>
          </Card>
        </Tab>

        <Tab eventKey="feedback" title="User Feedback">
          <Card>
            <Card.Header>
              <h5 className="mb-0">User Feedback</h5>
            </Card.Header>
            <Card.Body>
              {feedback.length === 0 ? (
                <Alert variant="info">No feedback found.</Alert>
              ) : (
                <Table responsive>
                  <thead>
                    <tr>
                      <th>Session</th>
                      <th>User</th>
                      <th>Rating</th>
                      <th>Comment</th>
                      <th>Date</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {feedback.map((item) => (
                      <tr key={item.id} className={item.flagged ? "table-warning" : ""}>
                        <td>{item.sessionTitle}</td>
                        <td>{item.userName}</td>
                        <td>{item.rating}/5</td>
                        <td>{item.comment}</td>
                        <td>{item.date}</td>
                        <td>
                          <div className="d-flex gap-2">
                            <Button
                              variant={item.flagged ? "outline-warning" : "outline-secondary"}
                              size="sm"
                              onClick={() => handleToggleFlagFeedback(item.id)}
                            >
                              {item.flagged ? "Unflag" : "Flag"}
                            </Button>
                            <Button variant="danger" size="sm" onClick={() => handleRemoveFeedback(item.id)}>
                              Remove
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
            </Card.Body>
          </Card>
        </Tab>
      </Tabs>
    </Container>
  )
}

export default CoordinatorDashboard

