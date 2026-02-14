import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    setOpen(false);
    navigate("/login");
  };

  return (
    <nav className={`navbar ${scrolled ? "scrolled" : ""}`}>
      {/* Top accent line */}
      <div className="navbar-accent" />

      <div className="navbar-container">

        {/* Logo */}
        <Link to="/" className="logo" onClick={() => setOpen(false)}>
          <span className="logo-mega">MEGA</span>
          <span className="logo-divider">—</span>
          <span className="logo-odds">ODDS</span>
        </Link>

        {/* Nav Links */}
        <ul className={`nav-links ${open ? "active" : ""}`}>

          <li>
            <Link to="/testimonials" onClick={() => setOpen(false)}>
              Members
            </Link>
          </li>

          <li>
            <Link to="/live" onClick={() => setOpen(false)}>
              Live Games
              <span className="live-dot" />
            </Link>
          </li>

          <li>
            <Link to="/features" onClick={() => setOpen(false)}>
              VIP 🔐
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
            <li className="auth-li">
              <Link to="/login" onClick={() => setOpen(false)}>
                <button className="cta-btn">
                  <span>Login</span>
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M1 7h12M7 1l6 6-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </Link>
            </li>
          ) : (
            <li className="auth-li">
              <button className="logout-btn" onClick={logout}>
                Logout
              </button>
            </li>
          )}
        </ul>

        {/* Mobile toggle */}
        <button
          className={`menu-toggle ${open ? "open" : ""}`}
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          <span /><span /><span />
        </button>

      </div>
    </nav>
  );
}

export default Navbar;
