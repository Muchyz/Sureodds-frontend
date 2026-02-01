import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api";
import "./Signup.css";

function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();

    try {
      await api.post("/register", { email, password });
      alert("Account created");
      navigate("/login");
    } catch (err) {
      alert(err.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2>Create Account</h2>

        <form onSubmit={handleSignup}>
          <input
            type="email"
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
          />

          <button>Create Account</button>
        </form>

        <Link to="/login" className="lgn">Login</Link>
      </div>
    </div>
  );
}

export default Signup;