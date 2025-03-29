"use client"

import { useState, useEffect } from "react"
import { Container, Row, Col, Card, Button, Form, Badge } from "react-bootstrap"
import { Link } from "react-router-dom"

// Mock data for sessions
const mockSessions = [
  {
    id: "1",
    title: "Introduction to React Hooks",
    speaker: "Jane Smith",
    speakerId: "2",
    date: "2023-06-15",
    time: "10:00 AM - 11:30 AM",
    location: "Room A",
    category: "Frontend",
    description: "Learn how to use React Hooks to simplify your components and manage state effectively.",
    attendees: 45,
    maxAttendees: 50,
  },
  {
    id: "2",
    title: "Advanced TypeScript Patterns",
    speaker: "John Doe",
    speakerId: "3",
    date: "2023-06-15",
    time: "1:00 PM - 2:30 PM",
    location: "Room B",
    category: "Programming",
    description: "Dive deep into advanced TypeScript patterns and techniques for large-scale applications.",
    attendees: 30,
    maxAttendees: 40,
  },
  {
    id: "3",
    title: "Building Scalable APIs with Node.js",
    speaker: "Alex Johnson",
    speakerId: "4",
    date: "2023-06-16",
    time: "9:00 AM - 10:30 AM",
    location: "Room C",
    category: "Backend",
    description: "Learn best practices for building scalable and maintainable APIs using Node.js and Express.",
    attendees: 38,
    maxAttendees: 40,
  },
  {
    id: "4",
    title: "UI/UX Design Principles",
    speaker: "Sarah Williams",
    speakerId: "5",
    date: "2023-06-16",
    time: "11:00 AM - 12:30 PM",
    location: "Room A",
    category: "Design",
    description: "Explore fundamental UI/UX design principles and how to apply them to create better user experiences.",
    attendees: 25,
    maxAttendees: 35,
  },
  {
    id: "5",
    title: "Microservices Architecture",
    speaker: "Michael Brown",
    speakerId: "6",
    date: "2023-06-17",
    time: "10:00 AM - 11:30 AM",
    location: "Room D",
    category: "Architecture",
    description:
      "Understand the benefits and challenges of microservices architecture and how to implement it effectively.",
    attendees: 40,
    maxAttendees: 40,
  },
]

const Sessions = () => {
  const [sessions, setSessions] = useState(mockSessions)
  const [filteredSessions, setFilteredSessions] = useState(mockSessions)
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("")

  const categories = [...new Set(sessions.map((session) => session.category))]

  useEffect(() => {
    // Filter sessions based on search term and category
    const filtered = sessions.filter((session) => {
      const matchesSearch =
        session.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        session.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        session.speaker.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesCategory = categoryFilter === "" || session.category === categoryFilter

      return matchesSearch && matchesCategory
    })

    setFilteredSessions(filtered)
  }, [searchTerm, categoryFilter, sessions])

  return (
    <Container>
      <h1 className="mb-4">Conference Sessions</h1>

      <Row className="mb-4">
        <Col md={6}>
          <Form.Group>
            <Form.Control
              type="text"
              placeholder="Search sessions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group>
            <Form.Select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        </Col>
      </Row>

      {filteredSessions.length === 0 ? (
        <Card className="text-center p-5">
          <Card.Body>
            <Card.Title>No Sessions Found</Card.Title>
            <Card.Text>Try adjusting your search criteria or check back later for new sessions.</Card.Text>
          </Card.Body>
        </Card>
      ) : (
        <Row>
          {filteredSessions.map((session) => (
            <Col md={6} lg={4} className="mb-4" key={session.id}>
              <Card className="h-100">
                <Card.Header>
                  <Badge bg="primary" className="me-2">
                    {session.category}
                  </Badge>
                  {session.attendees >= session.maxAttendees && <Badge bg="danger">Full</Badge>}
                </Card.Header>
                <Card.Body>
                  <Card.Title>{session.title}</Card.Title>
                  <Card.Subtitle className="mb-2 text-muted">
                    by <Link to={`/users/${session.speakerId}`}>{session.speaker}</Link>
                  </Card.Subtitle>
                  <Card.Text>{session.description.substring(0, 100)}...</Card.Text>
                  <div className="mb-3">
                    <small className="text-muted">
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
                    </small>
                  </div>
                </Card.Body>
                <Card.Footer>
                  <Link to={`/sessions/${session.id}`}>
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

export default Sessions

