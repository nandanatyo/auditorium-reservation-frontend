"use client"

import { Container, Row, Col, Card } from "react-bootstrap"
import { useParams } from "react-router-dom"

const UserProfile = () => {
  const { id } = useParams<{ id: string }>()

  // Mock user data - in a real app, you would fetch this from an API
  const user = {
    id,
    name: "Jane Smith",
    role: "Speaker",
    organization: "Tech Company",
    bio: "Experienced software developer with expertise in React and TypeScript.",
    sessions: [
      { id: "1", title: "Introduction to React Hooks" },
      { id: "2", title: "Advanced TypeScript Patterns" },
    ],
  }

  return (
    <Container className="py-4">
      <Row>
        <Col md={4}>
          <Card className="mb-4">
            <Card.Body className="text-center">
              <img
                src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random&size=128`}
                alt={user.name}
                className="rounded-circle mb-3"
                style={{ width: "150px", height: "150px" }}
              />
              <Card.Title>{user.name}</Card.Title>
              <Card.Subtitle className="mb-2 text-muted">{user.role}</Card.Subtitle>
              {user.organization && <p className="text-muted">{user.organization}</p>}
            </Card.Body>
          </Card>
        </Col>

        <Col md={8}>
          <Card className="mb-4">
            <Card.Header>Profile Information</Card.Header>
            <Card.Body>
              <h5>About</h5>
              <p>{user.bio}</p>

              <h5 className="mt-4">Sessions</h5>
              {user.sessions.length > 0 ? (
                <ul className="list-group">
                  {user.sessions.map((session) => (
                    <li key={session.id} className="list-group-item">
                      {session.title}
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
    </Container>
  )
}

export default UserProfile

