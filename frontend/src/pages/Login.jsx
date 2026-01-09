import React, { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ReCAPTCHA from "react-google-recaptcha";
import { useAuth } from "../context/AuthContext";

const SITE_KEY = process.env.REACT_APP_RECAPTCHA_SITE_KEY;

const Login = () => {
  const captchaRef = useRef(null);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const recaptchaToken = captchaRef.current?.getValue();
    if (!recaptchaToken) {
      setError("Please complete the reCAPTCHA.");
      setLoading(false);
      return;
    }

    try {
      await login(email, password, recaptchaToken);
      captchaRef.current?.reset();
      navigate("/dashboard");
    } catch (err) {
      captchaRef.current?.reset();
      setError(err.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-layout">
      <div className="auth-left">
        <h1>
          <span style={{ color: "#ffc107" }}>Swift</span>Shop
        </h1>
        <p>
          Welcome back. Sign in to manage your cart, track your orders, and get
          the latest deals on electronics and gadgets.
        </p>

        <div className="auth-badges">
          <span className="auth-badge">Fast checkout</span>
          <span className="auth-badge">Secure payments</span>
          <span className="auth-badge">Order tracking</span>
        </div>
      </div>

      <div className="ui-card">
        <div className="ui-card-header">
          <div>
            <h2>🔐 Login</h2>
            <p className="ui-muted">Enter your details to continue.</p>
          </div>
        </div>

        {error && <div className="ui-alert error">❌ {error}</div>}

        <div className="ui-card-body">
          <form onSubmit={handleSubmit} className="ui-form">
            <div className="ui-field">
              <label>Email</label>
              <input
                className="ui-input"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                disabled={loading}
                required
              />
            </div>

            <div className="ui-field">
              <label>Password</label>
              <input
                className="ui-input"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                disabled={loading}
                required
              />
            </div>

            {/* ✅ reCAPTCHA */}
            <div className="ui-field" style={{ marginTop: 12 }}>
              <ReCAPTCHA ref={captchaRef} sitekey={SITE_KEY} />
            </div>

            <div className="ui-actions">
              <button className="ui-btn primary" type="submit" disabled={loading}>
                {loading ? "⏳ Logging in..." : "Login"}
              </button>
              <Link className="ui-btn secondary" to="/register">
                Create account
              </Link>
            </div>

            <p className="ui-center ui-muted" style={{ marginTop: 8 }}>
              Don’t have an account?{" "}
              <Link className="ui-link" to="/register">
                Register here
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
