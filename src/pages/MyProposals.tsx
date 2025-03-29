"use client"

import { useState, useContext } from "react"
import { Container, Row, Col, Card, Badge, Button } from "react-bootstrap"
import { Link } from "react-router-dom"
import { UserContext } from "../context/UserContext"

const MyProposals = () => {
  const { user } = useContext(UserContext)

  // Mock proposals data - in a real app, you would fetch this from an API
  const [proposals] = useState([
    {
      id: "1",
      title: "Building Scalable React Applications",
      category: "Frontend",
      status: "pending",
      submittedDate: "2023-05-15",
      description: "Learn best practices for building scalable React applications.",
    },
    {
      id: "2",
      title: "Introduction to GraphQL",
      category: "Backend",
      status: "approved",
      submittedDate: "2023-05-10",
      description: "An introduction to GraphQL and how it compares to REST APIs.",
    },
    {
      id: "3",
      title: "Microservices with Node.js",
      category: "Architecture",
      status: "rejected",
      submittedDate: "2023-05-05",
      description: "Building microservices architecture with Node.js and Express.",
    },
  ])

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

  if (!user) {
    return (
      <Container className="py-4">
        <Card>
          <Card.Body className="text-center">
            <p>Please log in to view your proposals.</p>
            <Link to="/login">
              <Button variant="primary">Login</Button>
            </Link>
          </Card.Body>
        </Card>
      </Container>
    )
  }

  return (
    <Container className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>My Proposals</h1>
        <Link to="/create-proposal">
          <Button variant="primary">Create New Proposal</Button>
        </Link>
      </div>

      {proposals.length === 0 ? (
        <Card>
          <Card.Body className="text-center">
            <p>You haven't submitted any proposals yet.</p>
            <Link to="/create-proposal">
              <Button variant="primary">Create Your First Proposal</Button>
            </Link>
          </Card.Body>
        </Card>
      ) : (
        <Row>
          {proposals.map((proposal) => (
            <Col md={6} lg={4} className="mb-4" key={proposal.id}>
              <Card className="h-100">
                <Card.Header className="d-flex justify-content-between align-items-center">
                  <Badge bg="primary">{proposal.category}</Badge>
                  {getStatusBadge(proposal.status)}
                </Card.Header>
                <Card.Body>
                  <Card.Title>{proposal.title}</Card.Title>
                  <Card.Text>{proposal.description}</Card.Text>
                  <div className="text-muted mb-3">
                    <small>Submitted on: {proposal.submittedDate}</small>
                  </div>
                </Card.Body>
                <Card.Footer>
                  <Link to={`/my-proposals/${proposal.id}`}>
                    <Button variant="outline-primary" className="w-100">
                      View Details
                    </Button>
                  </Link>
                </Card.Footer>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  )
}

export default MyProposals

