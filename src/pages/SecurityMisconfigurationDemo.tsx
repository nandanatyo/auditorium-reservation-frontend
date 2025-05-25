import { useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Form,
  Alert,
  InputGroup,
  ListGroup,
} from "react-bootstrap";
import {
  makeRequestToAnyUrl,
  makeCrossSiteRequest,
  makeRepeatedRequests,
} from "../services/api";
import { conferenceService } from "../services/conference.service";

const SecurityMisconfigurationDemo = () => {
  const [corsUrl, setCorsUrl] = useState("");
  const [corsMethod, setCorsMethod] = useState("GET");
  const [corsData, setCorsData] = useState("{}");
  const [anyUrl, setAnyUrl] = useState("");
  const [corsResponse, setCorsResponse] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [requestsCount, setRequestsCount] = useState(10);
  const [repeatEndpoint, setRepeatEndpoint] = useState("/api/conferences");
  const [rateLimitResult, setRateLimitResult] = useState<any>(null);

  // VULNERABLE: Testing CORS misconfiguration allowing cross-site requests
  const handleTestCors = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setCorsResponse("");

    try {
      // This will work because of the AllowOrigins: "*" CORS setting in the backend
      const response = await makeCrossSiteRequest(
        corsUrl,
        corsMethod,
        corsMethod !== "GET" ? JSON.parse(corsData) : undefined
      );

      setCorsResponse(
        JSON.stringify(
          {
            status: response.status,
            statusText: response.statusText,
            headers: response.headers,
            data: response.data,
          },
          null,
          2
        )
      );
    } catch (err: any) {
      console.error("CORS test error:", err);
      setError(`CORS test failed: ${err.message || "Unknown error"}`);
    } finally {
      setIsLoading(false);
    }
  };

  // VULNERABLE: Making request to any URL (SSRF risk)
  const handleAnyUrlRequest = async () => {
    if (!anyUrl) {
      setError("Please enter a URL");
      return;
    }

    setIsLoading(true);
    setError("");
    setCorsResponse("");

    try {
      // This endpoint might allow the server to make requests to internal resources
      const response = await makeRequestToAnyUrl(anyUrl);

      setCorsResponse(
        JSON.stringify(
          {
            status: response.status,
            statusText: response.statusText,
            headers: response.headers,
            data: response.data,
          },
          null,
          2
        )
      );
    } catch (err: any) {
      console.error("URL request error:", err);
      setError(`Request failed: ${err.message || "Unknown error"}`);
    } finally {
      setIsLoading(false);
    }
  };

  // VULNERABLE: Testing for rate limiting issues
  const handleTestRateLimit = async () => {
    setIsLoading(true);
    setError("");
    setRateLimitResult(null);

    try {
      const startTime = Date.now();
      const results = await makeRepeatedRequests(repeatEndpoint, requestsCount);
      const endTime = Date.now();

      setRateLimitResult({
        requestCount: requestsCount,
        successCount: results.length,
        totalTimeMs: endTime - startTime,
        averageTimeMs: (endTime - startTime) / requestsCount,
        isRateLimited: false,
      });
    } catch (err: any) {
      console.error("Rate limit test error:", err);
      setError(`Rate limit test failed: ${err.message || "Unknown error"}`);

      // Check if this was due to rate limiting
      if (err.message && err.message.includes("rate")) {
        setRateLimitResult({
          requestCount: requestsCount,
          successCount: 0,
          isRateLimited: true,
          errorMessage: err.message,
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container className="py-4">
      <h1 className="mb-4">Security Misconfiguration Demo</h1>
      <Alert variant="danger">
        <Alert.Heading>Security Warning</Alert.Heading>
        <p>
          This page demonstrates security misconfigurations in the backend.
          These vulnerabilities can lead to serious security incidents and
          should never exist in production applications.
        </p>
      </Alert>

      <Row className="mb-4">
        <Col lg={6}>
          <Card className="mb-4 border-danger">
            <Card.Header className="bg-danger text-white">
              <h3>CORS Misconfiguration - AllowOrigins: "*"</h3>
            </Card.Header>
            <Card.Body>
              <Alert variant="warning">
                <p>
                  <strong>Vulnerability:</strong> The backend has CORS
                  configured to allow requests from any origin. This could allow
                  malicious websites to make authenticated requests to your API.
                </p>
                <pre className="bg-light p-2">
                  {`// Vulnerable CORS configuration:
config := cors.Config{
    AllowOrigins:  "*",  // Allows any origin!
    AllowMethods:  "GET,POST,PUT,DELETE,PATCH,OPTIONS,HEAD",
    AllowHeaders:  "Content-Type,Authorization,Accept...",
}`}
                </pre>
              </Alert>

              <Form onSubmit={handleTestCors}>
                <Form.Group className="mb-3">
                  <Form.Label>Target URL:</Form.Label>
                  <Form.Control
                    type="text"
                    value={corsUrl}
                    onChange={(e) => setCorsUrl(e.target.value)}
                    placeholder="https://example.com/api/endpoint"
                    required
                  />
                  <Form.Text className="text-muted">
                    Any domain should work due to CORS misconfiguration.
                  </Form.Text>
                </Form.Group>

                <Row className="mb-3">
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Method:</Form.Label>
                      <Form.Select
                        value={corsMethod}
                        onChange={(e) => setCorsMethod(e.target.value)}>
                        <option value="GET">GET</option>
                        <option value="POST">POST</option>
                        <option value="PUT">PUT</option>
                        <option value="DELETE">DELETE</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    {corsMethod !== "GET" && (
                      <Form.Group>
                        <Form.Label>Request Data (JSON):</Form.Label>
                        <Form.Control
                          as="textarea"
                          rows={2}
                          value={corsData}
                          onChange={(e) => setCorsData(e.target.value)}
                          placeholder="{}"
                        />
                      </Form.Group>
                    )}
                  </Col>
                </Row>

                <Button
                  variant="danger"
                  type="submit"
                  disabled={isLoading || !corsUrl}>
                  {isLoading ? "Testing..." : "Test CORS Vulnerability"}
                </Button>
              </Form>
            </Card.Body>
          </Card>

          <Card className="border-danger">
            <Card.Header className="bg-danger text-white">
              <h3>Rate Limiting Absence</h3>
            </Card.Header>
            <Card.Body>
              <Alert variant="warning">
                <p>
                  <strong>Vulnerability:</strong> The backend doesn't implement
                  any rate limiting, allowing attackers to make unlimited
                  requests which could lead to DoS attacks or brute force
                  attempts.
                </p>
              </Alert>

              <Form>
                <Row className="mb-3">
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Number of Requests:</Form.Label>
                      <Form.Control
                        type="number"
                        value={requestsCount}
                        onChange={(e) =>
                          setRequestsCount(parseInt(e.target.value) || 10)
                        }
                        min="1"
                        max="100"
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Endpoint:</Form.Label>
                      <Form.Control
                        type="text"
                        value={repeatEndpoint}
                        onChange={(e) => setRepeatEndpoint(e.target.value)}
                        placeholder="/api/endpoint"
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Button
                  variant="danger"
                  onClick={handleTestRateLimit}
                  disabled={isLoading || !repeatEndpoint}>
                  {isLoading ? "Testing..." : "Test Rate Limiting"}
                </Button>
              </Form>

              {rateLimitResult && (
                <div className="mt-3">
                  <h5>Rate Limit Test Results:</h5>
                  <ListGroup>
                    <ListGroup.Item>
                      Requests attempted: {rateLimitResult.requestCount}
                    </ListGroup.Item>
                    <ListGroup.Item>
                      Successful requests: {rateLimitResult.successCount}
                    </ListGroup.Item>
                    {rateLimitResult.isRateLimited ? (
                      <ListGroup.Item className="text-success">
                        Rate limiting detected! {rateLimitResult.errorMessage}
                      </ListGroup.Item>
                    ) : (
                      <ListGroup.Item className="text-danger">
                        No rate limiting detected! All{" "}
                        {rateLimitResult.successCount} requests succeeded.
                      </ListGroup.Item>
                    )}
                    {rateLimitResult.totalTimeMs && (
                      <>
                        <ListGroup.Item>
                          Total time: {rateLimitResult.totalTimeMs}ms
                        </ListGroup.Item>
                        <ListGroup.Item>
                          Average time per request:{" "}
                          {Math.round(rateLimitResult.averageTimeMs)}ms
                        </ListGroup.Item>
                      </>
                    )}
                  </ListGroup>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>

        <Col lg={6}>
          <Card className="border-danger">
            <Card.Header className="bg-danger text-white">
              <h3>SSRF Vulnerability</h3>
            </Card.Header>
            <Card.Body>
              <Alert variant="warning">
                <p>
                  <strong>Vulnerability:</strong> The API may allow requests to
                  arbitrary URLs (including internal resources) through a
                  misconfigured endpoint.
                </p>
                <p>
                  This could allow attackers to access internal services or
                  metadata endpoints in cloud environments.
                </p>
              </Alert>

              <Form>
                <Form.Group className="mb-3">
                  <Form.Label>Any URL Request:</Form.Label>
                  <Form.Control
                    type="text"
                    value={anyUrl}
                    onChange={(e) => setAnyUrl(e.target.value)}
                    placeholder="http://internal-service:8080"
                    required
                  />
                  <Form.Text className="text-muted">
                    Try with internal/private URLs like:
                    <br />
                    - http://localhost:8080
                    <br />
                    - http://169.254.169.254/latest/meta-data (AWS)
                    <br />- http://metadata.google.internal (GCP)
                  </Form.Text>
                </Form.Group>

                <Button
                  variant="danger"
                  onClick={handleAnyUrlRequest}
                  disabled={isLoading || !anyUrl}>
                  {isLoading ? "Requesting..." : "Make Request (SSRF Test)"}
                </Button>
              </Form>
            </Card.Body>
          </Card>

          {(corsResponse || error) && (
            <Card className="mt-4">
              <Card.Header>
                <h3>Response / Error</h3>
              </Card.Header>
              <Card.Body>
                {error && <Alert variant="danger">{error}</Alert>}
                {corsResponse && (
                  <pre
                    className="bg-light p-3"
                    style={{ maxHeight: "400px", overflow: "auto" }}>
                    {corsResponse}
                  </pre>
                )}
              </Card.Body>
            </Card>
          )}
        </Col>
      </Row>

      <Card className="mt-4">
        <Card.Header className="bg-warning">
          <h3>Security Recommendations</h3>
        </Card.Header>
        <Card.Body>
          <h4>How to Fix These Misconfigurations:</h4>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <strong>CORS Configuration:</strong> Specify exact allowed origins
              instead of using wildcards. For example:
              <code>
                AllowOrigins: []string
                {("https://yourdomain.com", "https://admin.yourdomain.com")}
              </code>
            </ListGroup.Item>
            <ListGroup.Item>
              <strong>Rate Limiting:</strong> Implement rate limiting
              middleware. Example:
              <pre className="bg-light p-2">
                {`// Example rate limiting middleware
limiter := rate.NewLimiter(rate.Every(time.Second), 10) // 10 requests per second
app.Use(func(c *fiber.Ctx) error {
    if !limiter.Allow() {
        return c.Status(429).JSON(map[string]string{
            "error": "Too many requests",
        })
    }
    return c.Next()
})`}
              </pre>
            </ListGroup.Item>
            <ListGroup.Item>
              <strong>SSRF Prevention:</strong> Validate and whitelist allowed
              URLs and domains. Never allow requests to internal/private IP
              ranges or sensitive domains.
            </ListGroup.Item>
          </ListGroup>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default SecurityMisconfigurationDemo;
