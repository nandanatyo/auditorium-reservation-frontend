import { useAuth } from "../contexts/auth/AuthProvider";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [isAccountDropdownOpen, setIsAccountDropdownOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);

  console.log("User in Navbar:", user);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const toggleMobileMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMobileMenu = () => {
    setIsOpen(false);
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark mb-4">
      <div className="container">
        <Link className="navbar-brand" to="/" onClick={closeMobileMenu}>
          Conference Hub
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          onClick={toggleMobileMenu}
          aria-controls="navbarNav"
          aria-expanded={isOpen}
          aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div
          className={`collapse navbar-collapse ${isOpen ? "show" : ""}`}
          id="navbarNav">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/" onClick={closeMobileMenu}>
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className="nav-link"
                to="/sessions"
                onClick={closeMobileMenu}>
                Sessions
              </Link>
            </li>
            {user && (
              <li className="nav-item dropdown">
                <a
                  className="nav-link dropdown-toggle"
                  href="#"
                  id="navbarDropdown"
                  role="button"
                  onClick={(e) => {
                    e.preventDefault();
                    setIsAccountDropdownOpen(!isAccountDropdownOpen);
                  }}
                  aria-expanded={isAccountDropdownOpen}>
                  My Account
                </a>
                <ul
                  className={`dropdown-menu ${
                    isAccountDropdownOpen ? "show" : ""
                  }`}
                  aria-labelledby="navbarDropdown">
                  <li>
                    <Link
                      className="dropdown-item"
                      to="/profile"
                      onClick={closeMobileMenu}>
                      My Profile
                    </Link>
                  </li>
                  <li>
                    <Link
                      className="dropdown-item"
                      to="/my-proposals"
                      onClick={closeMobileMenu}>
                      My Proposals
                    </Link>
                  </li>
                  <li>
                    <Link
                      className="dropdown-item"
                      to="/my-sessions"
                      onClick={closeMobileMenu}>
                      My Sessions
                    </Link>
                  </li>
                  <li>
                    <hr className="dropdown-divider" />
                  </li>
                  <li>
                    <Link
                      className="dropdown-item"
                      to="/create-proposal"
                      onClick={closeMobileMenu}>
                      Create Proposal
                    </Link>
                  </li>
                </ul>
              </li>
            )}
            {user && user.role === "event_coordinator" && (
              <li className="nav-item">
                <Link
                  className="nav-link"
                  to="/coordinator"
                  onClick={closeMobileMenu}>
                  Coordinator Dashboard
                </Link>
              </li>
            )}
            {user && user.role === "admin" && (
              <li className="nav-item">
                <Link
                  className="nav-link"
                  to="/admin"
                  onClick={closeMobileMenu}>
                  Admin Dashboard
                </Link>
              </li>
            )}
          </ul>

          <ul className="navbar-nav">
            {user ? (
              <li className="nav-item dropdown">
                <a
                  className="nav-link dropdown-toggle"
                  href="#"
                  id="userDropdown"
                  role="button"
                  onClick={(e) => {
                    e.preventDefault();
                    setIsUserDropdownOpen(!isUserDropdownOpen);
                  }}
                  aria-expanded={isUserDropdownOpen}>
                  {user.name}
                </a>
                <ul
                  className={`dropdown-menu dropdown-menu-end ${
                    isUserDropdownOpen ? "show" : ""
                  }`}
                  aria-labelledby="userDropdown">
                  <li>
                    <Link
                      className="dropdown-item"
                      to="/profile"
                      onClick={closeMobileMenu}>
                      Profile
                    </Link>
                  </li>
                  <li>
                    <Link
                      className="dropdown-item"
                      to="/edit-profile"
                      onClick={closeMobileMenu}>
                      Edit Profile
                    </Link>
                  </li>
                  <li>
                    <hr className="dropdown-divider" />
                  </li>
                  <li>
                    <button className="dropdown-item" onClick={handleLogout}>
                      Logout
                    </button>
                  </li>
                </ul>
              </li>
            ) : (
              <>
                <li className="nav-item">
                  <Link
                    className="nav-link"
                    to="/login"
                    onClick={closeMobileMenu}>
                    Login
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    className="nav-link"
                    to="/register"
                    onClick={closeMobileMenu}>
                    Register
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
