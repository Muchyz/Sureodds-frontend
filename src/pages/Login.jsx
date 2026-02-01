import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api";
import "./Login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await api.post("/login", { email, password });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("is_vip", res.data.is_vip);

      navigate("/features");
    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2>Login</h2>

        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button>Login</button>
        </form>

        <Link to="/signup">Create account</Link>
      </div>
    </div>
  );
}

export default Login;