import { Row, Col, Card, Button } from "react-bootstrap"
import { Link } from "react-router-dom"

const Home = () => {
  return (
    <>
      <Row className="mb-5">
        <Col>
          <div className="home-hero text-center">
            <h1>Welcome to Conference Hub</h1>
            <p className="lead">
              Discover, register, and participate in exciting conference sessions. Share your knowledge by proposing
              your own sessions.
            </p>
            <Link to="/sessions">
              <Button variant="light" size="lg">
                Browse Sessions
              </Button>
            </Link>
          </div>
        </Col>
      </Row>

      <Row className="mb-5">
        <Col md={4} className="mb-4">
          <Card className="h-100">
            <Card.Body>
              <Card.Title>Discover Sessions</Card.Title>
              <Card.Text>Browse through a wide range of conference sessions on various topics.</Card.Text>
              <Link to="/sessions">
                <Button variant="outline-primary">View Sessions</Button>
              </Link>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4} className="mb-4">
          <Card className="h-100">
            <Card.Body>
              <Card.Title>Propose a Session</Card.Title>
              <Card.Text>Share your expertise by proposing a session for the conference.</Card.Text>
              <Link to="/create-proposal">
                <Button variant="outline-primary">Create Proposal</Button>
              </Link>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4} className="mb-4">
          <Card className="h-100">
            <Card.Body>
              <Card.Title>Join the Community</Card.Title>
              <Card.Text>Connect with other attendees, speakers, and organizers.</Card.Text>
              <Link to="/register">
                <Button variant="outline-primary">Register Now</Button>
              </Link>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="mb-5">
        <Col>
          <h2 className="text-center mb-4">Upcoming Conferences</h2>
          <Card className="mb-4">
            <Card.Body>
              <Card.Title>Tech Conference 2023</Card.Title>
              <Card.Subtitle className="mb-2 text-muted">June 15-18, 2023</Card.Subtitle>
              <Card.Text>
                Join us for the biggest tech conference of the year, featuring speakers from leading tech companies.
              </Card.Text>
              <Button variant="primary">Learn More</Button>
            </Card.Body>
          </Card>
          <Card className="mb-4">
            <Card.Body>
              <Card.Title>Design Summit 2023</Card.Title>
              <Card.Subtitle className="mb-2 text-muted">July 10-12, 2023</Card.Subtitle>
              <Card.Text>
                A conference dedicated to UX/UI design, featuring workshops and talks from industry experts.
              </Card.Text>
              <Button variant="primary">Learn More</Button>
            </Card.Body>
          </Card>
          <Card>
            <Card.Body>
              <Card.Title>Data Science Conference</Card.Title>
              <Card.Subtitle className="mb-2 text-muted">August 5-7, 2023</Card.Subtitle>
              <Card.Text>Explore the latest trends and technologies in data science and machine learning.</Card.Text>
              <Button variant="primary">Learn More</Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  )
}

export default Home

