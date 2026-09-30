import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "./AuthLayout";
import "./Auth.css";

export default function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError(null);

    if (password.length < 7) {
      setError("Password must be at least 7 characters long.");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: username, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to create account.");
      }

      // Registration successful! Redirect to sign-in page
      navigate("/login");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      headline="Build conviction with every signal."
      subheadline="Create your MarketLens workspace for clear research, intelligent watchlists, and risk-free paper trading."
    >
      <div className="auth-form-container">
        <div className="form-card-inner">
          <h2 className="form-title">Create your account</h2>
          <p className="form-desc">
            Start with ₹10,00,000 in virtual funds and build your routine with confidence.
          </p>

          {error && <div className="auth-error-box">{error}</div>}

          <form onSubmit={handleRegister} className="form-body">
            {/* Username field */}
            <div className="field-group">
              <label>Username</label>
              <div className="input-with-icon">
                <span className="input-icon">👤</span>
                <input
                  type="text"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
            </div>

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
              <label>Create password</label>
              <div className="input-with-icon">
                <span className="input-icon">🔒</span>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="At least 7 characters"
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

            {/* Terms checkbox */}
            <div className="checkbox-row">
              <input
                type="checkbox"
                id="terms"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                required
              />
              <label htmlFor="terms">
                I agree to the Terms of Use and Privacy Policy.
              </label>
            </div>

            {/* Submit button */}
            <button type="submit" className="submit-auth-btn" disabled={loading}>
              {loading ? "Creating account..." : "Create my free account →"}
            </button>
          </form>

          <div className="form-subfooter">
            Already using MarketLens? <Link to="/login">Sign in instead</Link>
          </div>
        </div>
      </div>
    </AuthLayout>
  );
}
