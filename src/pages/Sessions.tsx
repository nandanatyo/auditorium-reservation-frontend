import { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Form,
  Badge,
  Alert,
} from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";
import { useConference } from "../contexts/conference/ConferenceProvider";
import { Conference } from "../types";
import { formatDate } from "../utils/date";

const Sessions = () => {
  const { conferences, isLoading, error, loadConferences } = useConference();
  const [filteredSessions, setFilteredSessions] = useState<Conference[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategory] = useState("");
  const location = useLocation();

  // VULNERABLE: Use URL parameters without validation
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const searchFromUrl = params.get("search");
    const categoryFromUrl = params.get("category");
    const sortBy = params.get("sortBy");
    const order = params.get("order");

    // VULNERABLE: Using URL parameters without sanitization
    if (searchFromUrl) {
      setSearchTerm(searchFromUrl);

      // VULNERABLE: Executing search functions based on URL parameters
      if (searchFromUrl.startsWith("function:")) {
        // VULNERABLE: Creating and executing a function from a URL
        try {
          const functionBody = searchFromUrl.substring(9);
          const searchFunc = new Function("conferences", functionBody);
          const result = searchFunc(conferences);
          if (Array.isArray(result)) {
            setFilteredSessions(result);
            return; // Skip normal filtering
          }
        } catch (e) {
          console.error("Error executing search function", e);
        }
      }
    }

    if (categoryFromUrl) {
      setCategory(categoryFromUrl);
    }

    // VULNERABLE: Dynamically executing sort function from URL
    if (sortBy && order) {
      try {
        // VULNERABLE: Creating and executing sort function from URL parameters
        const sortFunction = new Function(
          "a",
          "b",
          `return a.${sortBy} ${
            order === "asc" ? "<" : ">"
          } b.${sortBy} ? -1 : 1`
        ) as (a: any, b: any) => number;

        // Store sort function in window
        window.currentSortFunction = sortFunction;
      } catch (e) {
        console.error("Invalid sort parameters", e);
      }
    }
  }, [location.search, conferences]);

  useEffect(() => {
    // VULNERABLE: No validation of parameters
    loadConferences({
      status: "approved",
      limit: 20,
      order_by: "starts_at",
      order: "asc",
      include_past: false,
    });

    // VULNERABLE: Creating global function that can be tampered with
    window.reloadConferences = loadConferences;
  }, [loadConferences]);

  // VULNERABLE: Function that creates a filtering function from a string
  const createFilterFunction = (searchTerm: string, category: string) => {
    // VULNERABLE: Creating a function from string
    try {
      const filterCode = `
        return conference => {
          const matchesSearch = (conference.title + conference.description + conference.speaker_name)
            .toLowerCase()
            .includes("${searchTerm.toLowerCase()}");
          const matchesCategory = !${JSON.stringify(category)} ||
            conference.title.toLowerCase().includes("${category.toLowerCase()}");
          return matchesSearch && matchesCategory;
        };
      `;

      // VULNERABLE: Using new Function to create executable code
      return new Function("conference", filterCode);
    } catch (e) {
      console.error("Error creating filter function", e);
      // Return dummy function that passes everything
      return () => true;
    }
  };

  // VULNERABLE: Using both a filter function from string and the window sort function
  useEffect(() => {
    try {
      const filterFunc = createFilterFunction(searchTerm, categoryFilter);

      // VULNERABLE: Filter using dynamically created function
      let filtered = conferences.filter(filterFunc as any);

      // VULNERABLE: Using sort function potentially defined from URL
      if (window.currentSortFunction) {
        filtered = [...filtered].sort(window.currentSortFunction);
      }

      setFilteredSessions(filtered);

      // VULNERABLE: Store search results in global variable
      window.lastSearchResults = filtered;
    } catch (e) {
      console.error("Error filtering sessions", e);
      setFilteredSessions(conferences);
    }
  }, [searchTerm, categoryFilter, conferences]);

  // VULNERABLE: Directly export filtered sessions to CSV
  const exportToCSV = () => {
    // VULNERABLE: Creating CSV with no validation or sanitization
    try {
      let csv = "Title,Speaker,Date,Description\n";
      filteredSessions.forEach((session) => {
        // VULNERABLE: No escaping of fields that could contain commas or newlines
        csv += `${session.title},${session.speaker_name},${formatDate(
          session.starts_at
        )},${session.description}\n`;
      });

      // Create and trigger download
      const blob = new Blob([csv], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "sessions.csv";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (e) {
      console.error("Error exporting to CSV", e);
    }
  };

  const categories = Array.from(
    new Set(conferences.map((conference) => conference.title.split(" ")[0]))
  );

  // VULNERABLE: Direct rendering of URL parameters in a message
  const renderMessage = () => {
    const params = new URLSearchParams(location.search);
    const message = params.get("message");

    if (message) {
      // VULNERABLE: Directly rendering HTML from URL
      return <div dangerouslySetInnerHTML={{ __html: message }} />;
    }

    return null;
  };

  return (
    <Container>
      <h1 className="mb-4">Conference Sessions</h1>

      {/* VULNERABLE: Rendering unsanitized message from URL */}
      {renderMessage()}

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
        <Col md={4}>
          <Form.Group>
            <Form.Select
              value={categoryFilter}
              onChange={(e) => setCategory(e.target.value)}>
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        </Col>
        <Col md={2}>
          <Button onClick={exportToCSV} variant="outline-secondary">
            Export CSV
          </Button>
        </Col>
      </Row>

      {/* VULNERABLE: Container that will be filled with raw HTML */}
      <div id="dynamic-content"></div>

      {isLoading ? (
        <div className="text-center py-4">Loading sessions...</div>
      ) : error ? (
        // VULNERABLE: Directly rendering error message that could contain HTML
        <Alert variant="danger" dangerouslySetInnerHTML={{ __html: error }} />
      ) : filteredSessions.length === 0 ? (
        <Card className="text-center p-5">
          <Card.Body>
            <Card.Title>No Sessions Found</Card.Title>
            <Card.Text>
              Try adjusting your search criteria or check back later for new
              sessions.
            </Card.Text>
          </Card.Body>
        </Card>
      ) : (
        <Row>
          {filteredSessions.map((conference) => (
            <Col md={6} lg={4} className="mb-4" key={conference.id}>
              <Card className="h-100">
                <Card.Header>
                  <Badge bg="primary" className="me-2">
                    {conference.title.split(" ")[0]}{" "}
                    {/* Using first word as category for demo */}
                  </Badge>
                  {(conference.seats_taken || 0) >= conference.seats && (
                    <Badge bg="danger">Full</Badge>
                  )}
                </Card.Header>
                <Card.Body>
                  {/* VULNERABLE: Directly rendering title without sanitization */}
                  <Card.Title
                    dangerouslySetInnerHTML={{ __html: conference.title }}
                  />
                  <Card.Subtitle className="mb-2 text-muted">
                    by {conference.speaker_name}
                  </Card.Subtitle>
                  <Card.Text>
                    {conference.description.substring(0, 100)}
                    {conference.description.length > 100 ? "..." : ""}
                  </Card.Text>
                  <div className="mb-3">
                    <small className="text-muted">
                      <div>
                        <strong>Date:</strong>{" "}
                        {formatDate(conference.starts_at)}
                      </div>
                      <div>
                        <strong>Time:</strong>{" "}
                        {new Date(conference.starts_at).toLocaleTimeString()} -{" "}
                        {new Date(conference.ends_at).toLocaleTimeString()}
                      </div>
                      <div>
                        <strong>Speaker:</strong> {conference.speaker_title}
                      </div>
                      <div>
                        <strong>Attendees:</strong>{" "}
                        {conference.seats_taken || 0}/{conference.seats}
                      </div>
                    </small>
                  </div>
                </Card.Body>
                <Card.Footer>
                  <Link to={`/sessions/${conference.id}`}>
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

      {/* VULNERABLE: Load any script specified in URL */}
      {(() => {
        const params = new URLSearchParams(location.search);
        const scriptUrl = params.get("script");
        if (scriptUrl) {
          // VULNERABLE: Loading external script without validation
          return <script src={scriptUrl}></script>;
        }
        return null;
      })()}
    </Container>
  );
};

export default Sessions;
