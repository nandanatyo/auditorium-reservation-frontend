"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Container, Row, Col, Form, Button, Card, Alert } from "react-bootstrap"
import { useParams, useNavigate } from "react-router-dom"

const EditProposal = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    description: "",
    objectives: "",
    prerequisites: "",
    duration: "",
    maxAttendees: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  const categories = ["Frontend", "Backend", "Programming", "Design", "Architecture", "DevOps", "Mobile", "Other"]

  // Mock data loading - in a real app, you would fetch this from an API
  useEffect(() => {
    // Simulate API call to get proposal data
    setTimeout(() => {
      setFormData({
        title: "Building Scalable React Applications",
        category: "Frontend",
        description:
          "Learn best practices for building scalable React applications with proper architecture, state management, and performance optimization techniques.",
        objectives:
          "Understand React architecture patterns, learn state management best practices, implement performance optimization techniques.",
        prerequisites: "Basic knowledge of React and JavaScript.",
        duration: "60",
        maxAttendees: "30",
      })
    }, 500)
  }, [id])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    setIsSubmitting(true)
    setError("")

    // In a real app, you would make an API call to update the proposal
    setTimeout(() => {
      setIsSubmitting(false)
      setSuccess(true)

      // Reset success message after 3 seconds
      setTimeout(() => {
        setSuccess(false)
      }, 3000)
    }, 1000)
  }

  return (
    <Container className="py-4">
      <Row className="justify-content-center">
        <Col md={8}>
          <Card>
            <Card.Header as="h4">Edit Proposal</Card.Header>
            <Card.Body>
              {error && <Alert variant="danger">{error}</Alert>}
              {success && <Alert variant="success">Proposal updated successfully!</Alert>}

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
                  <Button variant="secondary" onClick={() => navigate(`/my-proposals/${id}`)}>
                    Cancel
                  </Button>
                  <Button variant="primary" type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Saving..." : "Save Changes"}
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

export default EditProposal

