"use client"

import type React from "react"

import { useState, useContext } from "react"
import { Container, Row, Col, Form, Button, Card, Alert } from "react-bootstrap"
import { useNavigate } from "react-router-dom"
import { UserContext } from "../context/UserContext"

const CreateProposal = () => {
  const { user } = useContext(UserContext)
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    description: "",
    objectives: "",
    prerequisites: "",
    duration: "60",
    maxAttendees: "30",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")

  const categories = ["Frontend", "Backend", "Programming", "Design", "Architecture", "DevOps", "Mobile", "Other"]

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!user) {
      navigate("/login")
      return
    }

    setIsSubmitting(true)
    setError("")

    // In a real app, you would make an API call to submit the proposal
    setTimeout(() => {
      setIsSubmitting(false)
      navigate("/my-proposals")
    }, 1000)
  }

  if (!user) {
    navigate("/login")
    return null
  }

  return (
    <Container>
      <Row className="justify-content-center">
        <Col md={8}>
          <Card>
            <Card.Header as="h4">Create Session Proposal</Card.Header>
            <Card.Body>
              {error && <Alert variant="danger">{error}</Alert>}

              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Session Title</Form.Label>
                  <Form.Control
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="Enter a descriptive title for your session"
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Category</Form.Label>
                  <Form.Select name="category" value={formData.category} onChange={handleChange} required>
                    <option value="">Select a category</option>
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={4}
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Provide a detailed description of your session"
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Learning Objectives</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="objectives"
                    value={formData.objectives}
                    onChange={handleChange}
                    placeholder="What will attendees learn from your session?"
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Prerequisites</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={2}
                    name="prerequisites"
                    value={formData.prerequisites}
                    onChange={handleChange}
                    placeholder="What should attendees already know before attending your session?"
                  />
                </Form.Group>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Duration (minutes)</Form.Label>
                      <Form.Select name="duration" value={formData.duration} onChange={handleChange} required>
                        <option value="30">30 minutes</option>
                        <option value="45">45 minutes</option>
                        <option value="60">60 minutes</option>
                        <option value="90">90 minutes</option>
                        <option value="120">120 minutes</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Maximum Attendees</Form.Label>
                      <Form.Control
                        type="number"
                        name="maxAttendees"
                        value={formData.maxAttendees}
                        onChange={handleChange}
                        min="5"
                        max="100"
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <div className="d-flex justify-content-between">
                  <Button variant="secondary" onClick={() => navigate(-1)}>
                    Cancel
                  </Button>
                  <Button variant="primary" type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Submitting..." : "Submit Proposal"}
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  )
}

export default CreateProposal

