import { useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Form,
  Alert,
} from "react-bootstrap";
import { conferenceService } from "../services/conference.service";
import { Conference } from "../types";

const SQLInjectionDemo = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [customLimit, setCustomLimit] = useState("10");
  const [conferenceId, setConferenceId] = useState("");
  const [results, setResults] = useState<Conference[]>([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const handleCustomSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setResults([]);
    setSuccessMessage("");

    try {
      // VULNERABLE: Directly passes user input to backend where SQL injection can occur
      const searchResults = await conferenceService.customSearch(searchTerm);
      setResults(searchResults);
      setSuccessMessage(`Found ${searchResults.length} results`);
    } catch (err: any) {
      console.error("Search error:", err);
      setError(err.message || "An error occurred during search");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGetConferences = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setResults([]);
    setSuccessMessage("");

    try {
      // VULNERABLE: Uses limit parameter that's vulnerable to SQL injection
      const response = await conferenceService.getConferences({
        limit: parseInt(customLimit),
        status: "approved",
        order_by: "starts_at",
        order: "asc",
      });
      setResults(response.conferences);
      setSuccessMessage(`Retrieved ${response.conferences.length} conferences`);
    } catch (err: any) {
      console.error("Error fetching conferences:", err);
      setError(err.message || "An error occurred fetching conferences");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGetConferenceById = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setResults([]);
    setSuccessMessage("");

    try {
      // VULNERABLE: Conference ID directly used in SQL query on backend
      const conference = await conferenceService.getConference(conferenceId);
      setResults([conference]);
      setSuccessMessage("Conference retrieved successfully");
    } catch (err: any) {
      console.error("Error fetching conference:", err);
      setError(err.message || "An error occurred fetching the conference");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container className="py-4">
      <h1 className="mb-4">SQL Injection Testing Tool</h1>
      <p className="lead text-danger">
        This page demonstrates SQL injection vulnerabilities in the backend. DO
        NOT use in production.
      </p>

      <Row className="mb-4">
        <Col md={12}>
          <Card className="border-danger">
            <Card.Header className="bg-danger text-white">
              <h3>Conference Search - SQL Injection Vulnerability</h3>
            </Card.Header>
            <Card.Body>
              <p>
                The backend uses string concatenation in SQL queries. Try these
                payloads:
              </p>
              <ul>
                <li>
                  <code>' OR '1'='1</code> - Shows all conferences
                </li>
                <li>
                  <code>
                    ' UNION SELECT id, title, description, speaker_name,
                    speaker_title, target_audience, prerequisites, seats,
                    starts_at, ends_at, host_id, status FROM users; --
                  </code>{" "}
                  - Attempts to extract user data
                </li>
                <li>
                  <code>' OR '1'='1'; DROP TABLE conferences; --</code> -
                  Destructive query (may cause data loss)
                </li>
              </ul>

              <Form onSubmit={handleCustomSearch}>
                <Form.Group className="mb-3">
                  <Form.Label>
                    Search Term (Vulnerable to SQL Injection):
                  </Form.Label>
                  <Form.Control
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Enter search term or SQL injection payload"
                  />
                  <Form.Text className="text-muted">
                    Backend uses string concatenation instead of prepared
                    statements.
                  </Form.Text>
                </Form.Group>

                <Button variant="danger" type="submit" disabled={isLoading}>
                  {isLoading ? "Searching..." : "Search (Vulnerable)"}
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="mb-4">
        <Col md={6}>
          <Card className="border-danger">
            <Card.Header className="bg-danger text-white">
              <h3>LIMIT Parameter Injection</h3>
            </Card.Header>
            <Card.Body>
              <p>The LIMIT clause is vulnerable to SQL injection. Try:</p>
              <ul>
                <li>
                  <code>10; DELETE FROM conferences; --</code>
                </li>
                <li>
                  <code>10 UNION SELECT * FROM users</code>
                </li>
              </ul>

              <Form onSubmit={handleGetConferences}>
                <Form.Group className="mb-3">
                  <Form.Label>LIMIT Parameter:</Form.Label>
                  <Form.Control
                    type="text"
                    value={customLimit}
                    onChange={(e) => setCustomLimit(e.target.value)}
                    placeholder="Enter LIMIT value or SQL injection"
                  />
                </Form.Group>

                <Button variant="danger" type="submit" disabled={isLoading}>
                  {isLoading ? "Loading..." : "Get Conferences (Vulnerable)"}
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6}>
          <Card className="border-danger">
            <Card.Header className="bg-danger text-white">
              <h3>ID Parameter Injection</h3>
            </Card.Header>
            <Card.Body>
              <p>The ID parameter is vulnerable to SQL injection. Try:</p>
              <ul>
                <li>
                  <code>1' OR '1'='1</code> - Shows first conference
                </li>
                <li>
                  <code>1'; DROP TABLE feedbacks; --</code> - Destructive query
                </li>
              </ul>

              <Form onSubmit={handleGetConferenceById}>
                <Form.Group className="mb-3">
                  <Form.Label>Conference ID:</Form.Label>
                  <Form.Control
                    type="text"
                    value={conferenceId}
                    onChange={(e) => setConferenceId(e.target.value)}
                    placeholder="Enter conference ID or SQL injection"
                  />
                </Form.Group>

                <Button variant="danger" type="submit" disabled={isLoading}>
                  {isLoading ? "Loading..." : "Get Conference (Vulnerable)"}
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {error && (
        <Alert variant="danger" className="mt-3">
          {error}
        </Alert>
      )}

      {successMessage && (
        <Alert variant="success" className="mt-3">
          {successMessage}
        </Alert>
      )}

      {results.length > 0 && (
        <Card className="mt-4">
          <Card.Header>
            <h3>Results</h3>
          </Card.Header>
          <Card.Body>
            <pre>{JSON.stringify(results, null, 2)}</pre>
          </Card.Body>
        </Card>
      )}

      <Alert variant="warning" className="mt-5">
        <Alert.Heading>Important Security Warning</Alert.Heading>
        <p>
          This demo page intentionally exposes SQL injection vulnerabilities. In
          a real application, you should NEVER:
        </p>
        <ul>
          <li>Concatenate user input directly into SQL queries</li>
          <li>Display detailed error messages from database operations</li>
          <li>Allow unlimited SQL operations without proper access controls</li>
        </ul>
        <p>
          Always use prepared statements/parameterized queries, validate input,
          implement proper access controls, and follow the principle of least
          privilege.
        </p>
      </Alert>
    </Container>
  );
};

export default SQLInjectionDemo;
