import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import api from "@/api";
import "./Login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await api.post("/login", { email, password });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("is_vip", res.data.is_vip);

      toast.success("Login successful 🎉", { autoClose: 2000 });
      setTimeout(() => navigate("/features"), 1000);
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed ❌", {
        autoClose: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <ToastContainer position="top-right" />

      <div className="auth-container">
        {/* Left panel */}
        <div className="auth-left">
          <h1>Welcome Back!</h1>
          <p>Login to access your VIP dashboard and exclusive features.</p>
          <img
            src="https://images.unsplash.com/photo-1603791440384-56cd371ee9a7?auto=format&fit=crop&w=800&q=80"
            alt="VIP"
          />
        </div>

        {/* Right panel */}
        <div className="auth-right">
          <div className="auth-card">
            <h2>Login</h2>
            <form onSubmit={handleLogin}>
              <div className="input-group">
                <label>Email</label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="input-group">
                <label>Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <button disabled={loading}>
                {loading ? "Logging in..." : "Login"}
              </button>
            </form>

            <div className="auth-footer">
              <span>Don’t have an account?</span>
              <Link to="/signup">Create one</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;