"use client"

import type React from "react"

import { useState } from "react"
import { Container, Row, Col, Card, Table, Badge, Button, Tabs, Tab, Form, Alert } from "react-bootstrap"

const AdminDashboard = () => {
  const [key, setKey] = useState("users")
  const [users, setUsers] = useState([
    {
      id: "1",
      name: "John Doe",
      email: "john@example.com",
      role: "user",
      registeredDate: "2023-04-10",
    },
    {
      id: "2",
      name: "Jane Smith",
      email: "jane@example.com",
      role: "coordinator",
      registeredDate: "2023-04-15",
    },
    {
      id: "3",
      name: "Alex Johnson",
      email: "alex@example.com",
      role: "user",
      registeredDate: "2023-04-20",
    },
    {
      id: "4",
      name: "Sarah Williams",
      email: "sarah@example.com",
      role: "user",
      registeredDate: "2023-04-25",
    },
  ])

  const [newCoordinator, setNewCoordinator] = useState({ name: "", email: "", password: "" })
  const [showSuccess, setShowSuccess] = useState(false)
  const [showError, setShowError] = useState(false)

  const handleRemoveUser = (id: string) => {
    setUsers(users.filter((user) => user.id !== id))
  }

  const handlePromoteToCoordinator = (id: string) => {
    setUsers(users.map((user) => (user.id === id ? { ...user, role: "coordinator" } : user)))
  }

  const handleDemoteToUser = (id: string) => {
    setUsers(users.map((user) => (user.id === id ? { ...user, role: "user" } : user)))
  }

  const handleAddCoordinator = (e: React.FormEvent) => {
    e.preventDefault()

    // In a real app, you would make an API call to create the coordinator
    const newUser = {
      id: Math.random().toString(),
      name: newCoordinator.name,
      email: newCoordinator.email,
      role: "coordinator",
      registeredDate: new Date().toISOString().split("T")[0],
    }

    setUsers([...users, newUser])
    setNewCoordinator({ name: "", email: "", password: "" })
    setShowSuccess(true)

    // Reset success message after 3 seconds
    setTimeout(() => {
      setShowSuccess(false)
    }, 3000)
  }

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "admin":
        return <Badge bg="danger">Admin</Badge>
      case "coordinator":
        return <Badge bg="success">Coordinator</Badge>
      case "user":
        return <Badge bg="primary">User</Badge>
      default:
        return <Badge bg="secondary">Unknown</Badge>
    }
  }

  return (
    <Container className="py-4">
      <h1 className="mb-4">Admin Dashboard</h1>

      <Tabs id="admin-tabs" activeKey={key} onSelect={(k) => setKey(k || "users")} className="mb-4">
        <Tab eventKey="users" title="User Management">
          <Card>
            <Card.Header>
              <h5 className="mb-0">All Users</h5>
            </Card.Header>
            <Card.Body>
              <Table responsive>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Registered</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id}>
                      <td>{user.name}</td>
                      <td>{user.email}</td>
                      <td>{getRoleBadge(user.role)}</td>
                      <td>{user.registeredDate}</td>
                      <td>
                        <div className="d-flex gap-2">
                          {user.role === "user" && (
                            <Button variant="success" size="sm" onClick={() => handlePromoteToCoordinator(user.id)}>
                              Make Coordinator
                            </Button>
                          )}
                          {user.role === "coordinator" && (
                            <Button variant="warning" size="sm" onClick={() => handleDemoteToUser(user.id)}>
                              Remove Coordinator
                            </Button>
                          )}
                          <Button variant="danger" size="sm" onClick={() => handleRemoveUser(user.id)}>
                            Remove User
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Tab>

        <Tab eventKey="add-coordinator" title="Add Coordinator">
          <Card>
            <Card.Header>
              <h5 className="mb-0">Add New Coordinator</h5>
            </Card.Header>
            <Card.Body>
              {showSuccess && <Alert variant="success">Coordinator added successfully!</Alert>}
              {showError && <Alert variant="danger">Failed to add coordinator. Please try again.</Alert>}

              <Form onSubmit={handleAddCoordinator}>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Full Name</Form.Label>
                      <Form.Control
                        type="text"
                        value={newCoordinator.name}
                        onChange={(e) => setNewCoordinator({ ...newCoordinator, name: e.target.value })}
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Email Address</Form.Label>
                      <Form.Control
                        type="email"
                        value={newCoordinator.email}
                        onChange={(e) => setNewCoordinator({ ...newCoordinator, email: e.target.value })}
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mb-3">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    value={newCoordinator.password}
                    onChange={(e) => setNewCoordinator({ ...newCoordinator, password: e.target.value })}
                    required
                  />
                </Form.Group>

                <Button variant="primary" type="submit">
                  Add Coordinator
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Tab>
      </Tabs>
    </Container>
  )
}

export default AdminDashboard

