import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "./AuthLayout";
import "./Auth.css";

export default function Login({ onLoginSuccess }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      setLoading(true);
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Invalid credentials.");
      }

      // Store token & user data in localStorage
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      if (onLoginSuccess) {
        onLoginSuccess(data.user);
      }

      // Navigate to Dashboard
      navigate("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      headline="See the market before it moves."
      subheadline="Return to a focused view of Indian equities, real-time signals, and your watchlists."
    >
      <div className="auth-form-container">
        <div className="form-card-inner">
          <h2 className="form-title">Welcome back</h2>
          <p className="form-desc">
            Sign in with your email and password to access your watchlists & portfolio.
          </p>

          {error && <div className="auth-error-box">{error}</div>}

          <form onSubmit={handleLogin} className="form-body">
            {/* Email field */}
            <div className="field-group">
              <label>Email address</label>
              <div className="input-with-icon">
                <span className="input-icon">✉️</span>
                <input
                  type="email"
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Password field */}
            <div className="field-group">
              <label>Password</label>
              <div className="input-with-icon">
                <span className="input-icon">🔒</span>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="toggle-password-btn"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? "👁️" : "🙈"}
                </button>
              </div>
            </div>

            {/* Remember me & forgot password */}
            <div className="auth-options-row">
              <div className="checkbox-row-inline">
                <input
                  type="checkbox"
                  id="remember"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <label htmlFor="remember">Remember me</label>
              </div>
              <span className="forgot-link">Forgot password?</span>
            </div>

            {/* Submit button */}
            <button type="submit" className="submit-auth-btn" disabled={loading}>
              {loading ? "Signing in..." : "Sign in to account →"}
            </button>
          </form>

          <div className="form-subfooter">
            Don't have an account? <Link to="/register">Register free</Link>
          </div>
        </div>
      </div>
    </AuthLayout>
  );
}
