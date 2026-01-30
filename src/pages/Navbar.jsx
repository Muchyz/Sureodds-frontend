import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  const logout = () => {
    localStorage.removeItem("token");
    setOpen(false);
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">

        {/* Logo */}
        <Link to="/" className="logo" onClick={() => setOpen(false)}>
          Sure Odds
        </Link>

        {/* Nav Links */}
        <ul className={`nav-links ${open ? "active" : ""}`}>

          <li>
            <Link to="/live" onClick={() => setOpen(false)}>
              Live Games
            </Link>
          </li>

          <li>
            <Link to="/features" onClick={() => setOpen(false)}>
              Features
            </Link>
          </li>

          <li>
            <Link to="/matches" onClick={() => setOpen(false)}>
              Matches
            </Link>
          </li>

          <li>
            <Link to="/pricing" onClick={() => setOpen(false)}>
              Pricing
            </Link>
          </li>

          <li>
            <Link to="/about" onClick={() => setOpen(false)}>
              About
            </Link>
          </li>

          <li>
            <Link to="/contact" onClick={() => setOpen(false)}>
              Contact
            </Link>
          </li>

          {/* Auth button */}
          {!token ? (
            <li>
              <Link to="/login" onClick={() => setOpen(false)}>
                <button className="cta-btn">Login</button>
              </Link>
            </li>
          ) : (
            <li>
              <button className="logout-btn" onClick={logout}>
                Logout
              </button>
            </li>
          )}
        </ul>

        {/* Mobile toggle */}
        <div className="menu-toggle" onClick={() => setOpen(!open)}>
          ☰
        </div>

      </div>
    </nav>
  );
}

export default Navbar;