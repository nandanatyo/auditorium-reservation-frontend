"use client"

import { useState, useContext } from "react"
import { Container, Row, Col, Card, Badge, Button } from "react-bootstrap"
import { Link } from "react-router-dom"
import { UserContext } from "../context/UserContext"

const MySessions = () => {
  const { user } = useContext(UserContext)

  // Mock sessions data - in a real app, you would fetch this from an API
  const [sessions] = useState([
    {
      id: "1",
      title: "Introduction to GraphQL",
      date: "2023-06-15",
      time: "10:00 AM - 11:30 AM",
      location: "Room A",
      attendees: 25,
      maxAttendees: 30,
      category: "Backend",
    },
    {
      id: "2",
      title: "React Performance Optimization",
      date: "2023-06-16",
      time: "2:00 PM - 3:30 PM",
      location: "Room B",
      attendees: 35,
      maxAttendees: 40,
      category: "Frontend",
    },
  ])

  if (!user) {
    return (
      <Container className="py-4">
        <Card>
          <Card.Body className="text-center">
            <p>Please log in to view your sessions.</p>
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
      <h1 className="mb-4">My Sessions</h1>

      {sessions.length === 0 ? (
        <Card>
          <Card.Body className="text-center">
            <p>You don't have any sessions yet.</p>
            <Link to="/create-proposal">
              <Button variant="primary">Create a Proposal</Button>
            </Link>
          </Card.Body>
        </Card>
      ) : (
        <Row>
          {sessions.map((session) => (
            <Col md={6} className="mb-4" key={session.id}>
              <Card>
                <Card.Header className="d-flex justify-content-between align-items-center">
                  <Badge bg="primary">{session.category}</Badge>
                </Card.Header>
                <Card.Body>
                  <Card.Title>{session.title}</Card.Title>
                  <div className="mb-3">
                    <div>
                      <strong>Date:</strong> {session.date}
                    </div>
                    <div>
                      <strong>Time:</strong> {session.time}
                    </div>
                    <div>
                      <strong>Location:</strong> {session.location}
                    </div>
                    <div>
                      <strong>Attendees:</strong> {session.attendees}/{session.maxAttendees}
                    </div>
                  </div>
                  <div className="d-flex gap-2">
                    <Link to={`/edit-session/${session.id}`}>
                      <Button variant="outline-primary">Edit</Button>
                    </Link>
                    <Link to={`/sessions/${session.id}`}>
                      <Button variant="outline-secondary">View Details</Button>
                    </Link>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  )
}

export default MySessions

