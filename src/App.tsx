import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import Sessions from "./pages/Sessions";
import SessionDetails from "./pages/SessionDetails";
import UserProfile from "./pages/UserProfile";
import CreateProposal from "./pages/CreateProposal";
import MyProposals from "./pages/MyProposals";
import ProposalDetails from "./pages/ProposalDetails";
import EditProposal from "./pages/EditProposal";
import MySessions from "./pages/MySessions";
import EditSession from "./pages/EditSession";
import EditProfile from "./pages/EditProfile";
import CoordinatorDashboard from "./pages/CoordinatorDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import { UserProvider } from "./context/UserContext";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import { AuthProvider } from "./contexts/auth/AuthProvider";
import { ConferenceProvider } from "./contexts/conference/ConferenceProvider";
import { FeedbackProvider } from "./contexts/feedback/FeedbackProvider";
import { RegistrationProvider } from "./contexts/registration/RegistrationProvider";
import Conferences from "./pages/Conferences";

// Importing our vulnerability demonstration pages
import SQLInjectionDemo from "./pages/SQLInjectionDemo";
import AuthenticationVulnerabilities from "./pages/AuthenticationVulnerabilities";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import SecurityMisconfigurationDemo from "./pages/SecurityMisconfigurationDemo";

function App() {
  return (
    <AuthProvider>
      <UserProvider>
        <ConferenceProvider>
          <FeedbackProvider>
            <RegistrationProvider>
              <Router>
                <div className="d-flex flex-column min-vh-100">
                  <Navbar />
                  <main className="flex-grow-1 container py-4">
                    <div className="content-wrapper bg-white bg-opacity-75 rounded shadow p-3 mb-5">
                      <Routes>
                        {/* Original routes */}
                        <Route path="/" element={<Home />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/sessions" element={<Sessions />} />
                        <Route
                          path="/sessions/:id"
                          element={<SessionDetails />}
                        />
                        <Route path="/users/:id" element={<UserProfile />} />
                        <Route path="/profile" element={<Profile />} />
                        <Route path="/edit-profile" element={<EditProfile />} />
                        <Route
                          path="/create-proposal"
                          element={<CreateProposal />}
                        />
                        <Route path="/my-proposals" element={<MyProposals />} />
                        <Route
                          path="/my-proposals/:id"
                          element={<ProposalDetails />}
                        />
                        <Route
                          path="/edit-proposal/:id"
                          element={<EditProposal />}
                        />
                        <Route path="/my-sessions" element={<MySessions />} />
                        <Route
                          path="/edit-session/:id"
                          element={<EditSession />}
                        />
                        <Route path="/conference" element={<Conferences />} />
                        <Route
                          path="/coordinator"
                          element={<CoordinatorDashboard />}
                        />
                        <Route path="/admin" element={<AdminDashboard />} />

                        {/* Vulnerability demonstration routes */}
                        <Route
                          path="/sql-injection"
                          element={<SQLInjectionDemo />}
                        />
                        <Route
                          path="/auth-vulnerabilities"
                          element={<AuthenticationVulnerabilities />}
                        />
                        <Route
                          path="/reset-password"
                          element={<ResetPasswordPage />}
                        />
                        <Route
                          path="/security-misconfiguration"
                          element={<SecurityMisconfigurationDemo />}
                        />
                      </Routes>
                    </div>
                  </main>
                  <Footer />
                </div>
              </Router>
            </RegistrationProvider>
          </FeedbackProvider>
        </ConferenceProvider>
      </UserProvider>
    </AuthProvider>
  );
}

export default App;
