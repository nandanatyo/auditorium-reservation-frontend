"use client"

import { useContext } from "react"
import { Container, Row, Col, Card, Button, ListGroup } from "react-bootstrap"
import { Link } from "react-router-dom"
import { UserContext } from "../context/UserContext"

const Profile = () => {
  const { user } = useContext(UserContext)

  if (!user) {
    return (
      <Container>
        <Row className="justify-content-center">
          <Col md={8}>
            <Card>
              <Card.Body className="text-center">
                <p>Please log in to view your profile.</p>
                <Link to="/login">
                  <Button variant="primary">Login</Button>
                </Link>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    )
  }

  return (
    <Container>
      <Row>
        <Col md={4}>
          <Card className="mb-4">
            <Card.Body className="text-center">
              <div className="mb-3">
                <img
                  src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random&size=128`}
                  alt={user.name}
                  className="rounded-circle img-fluid"
                  style={{ width: "150px", height: "150px" }}
                />
              </div>
              <Card.Title>{user.name}</Card.Title>
              <Card.Subtitle className="mb-2 text-muted">
                {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
              </Card.Subtitle>
              {user.organization && <p className="text-muted">{user.organization}</p>}
              <Link to="/edit-profile">
                <Button variant="outline-primary">Edit Profile</Button>
              </Link>
            </Card.Body>
          </Card>

          <Card>
            <Card.Header>Quick Links</Card.Header>
            <ListGroup variant="flush">
              <ListGroup.Item action as={Link} to="/my-proposals">
                My Proposals
              </ListGroup.Item>
              <ListGroup.Item action as={Link} to="/my-sessions">
                My Sessions
              </ListGroup.Item>
              <ListGroup.Item action as={Link} to="/create-proposal">
                Create New Proposal
              </ListGroup.Item>
              {user.role === "coordinator" && (
                <ListGroup.Item action as={Link} to="/coordinator">
                  Coordinator Dashboard
                </ListGroup.Item>
              )}
              {user.role === "admin" && (
                <ListGroup.Item action as={Link} to="/admin">
                  Admin Dashboard
                </ListGroup.Item>
              )}
            </ListGroup>
          </Card>
        </Col>

        <Col md={8}>
          <Card className="mb-4">
            <Card.Header>Profile Information</Card.Header>
            <Card.Body>
              <Row>
                <Col sm={3}>
                  <strong>Full Name:</strong>
                </Col>
                <Col sm={9}>{user.name}</Col>
              </Row>
              <hr />
              <Row>
                <Col sm={3}>
                  <strong>Email:</strong>
                </Col>
                <Col sm={9}>{user.email}</Col>
              </Row>
              <hr />
              <Row>
                <Col sm={3}>
                  <strong>Role:</strong>
                </Col>
                <Col sm={9}>{user.role.charAt(0).toUpperCase() + user.role.slice(1)}</Col>
              </Row>
              {user.organization && (
                <>
                  <hr />
                  <Row>
                    <Col sm={3}>
                      <strong>Organization:</strong>
                    </Col>
                    <Col sm={9}>{user.organization}</Col>
                  </Row>
                </>
              )}
              {user.bio && (
                <>
                  <hr />
                  <Row>
                    <Col sm={3}>
                      <strong>Bio:</strong>
                    </Col>
                    <Col sm={9}>{user.bio}</Col>
                  </Row>
                </>
              )}
            </Card.Body>
          </Card>

          <Card>
            <Card.Header>Activity Summary</Card.Header>
            <Card.Body>
              <Row>
                <Col md={4} className="text-center mb-3">
                  <h3>5</h3>
                  <p className="text-muted">Sessions Attended</p>
                </Col>
                <Col md={4} className="text-center mb-3">
                  <h3>2</h3>
                  <p className="text-muted">Proposals Submitted</p>
                </Col>
                <Col md={4} className="text-center mb-3">
                  <h3>3</h3>
                  <p className="text-muted">Feedback Given</p>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  )
}

export default Profile

