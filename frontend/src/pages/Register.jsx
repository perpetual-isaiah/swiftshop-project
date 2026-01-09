import React, { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ReCAPTCHA from "react-google-recaptcha";
import { useAuth } from "../context/AuthContext";

const SITE_KEY = process.env.REACT_APP_RECAPTCHA_SITE_KEY;

const Register = () => {
  const captchaRef = useRef(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    const recaptchaToken = captchaRef.current?.getValue();
    if (!recaptchaToken) {
      setError("Please complete the reCAPTCHA.");
      return;
    }

    setLoading(true);
    try {
      await register(name, email, password, recaptchaToken);
      captchaRef.current?.reset();
      navigate("/dashboard");
    } catch (err) {
      captchaRef.current?.reset();
      setError(err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-layout">
      <div className="auth-left">
        <h1>
          Join <span style={{ color: "#ffc107" }}>Swift</span>Shop
        </h1>
        <p>
          Create your account to shop electronics, save items to cart, and track
          orders easily — all in one place.
        </p>

        <div className="auth-badges">
          <span className="auth-badge">New deals</span>
          <span className="auth-badge">Fast delivery</span>
          <span className="auth-badge">Trusted products</span>
        </div>
      </div>

      <div className="ui-card">
        <div className="ui-card-header">
          <div>
            <h2>✨ Create Account</h2>
            <p className="ui-muted">It takes less than a minute.</p>
          </div>
        </div>

        {error && <div className="ui-alert error">❌ {error}</div>}

        <div className="ui-card-body">
          <form onSubmit={handleSubmit} className="ui-form">
            <div className="ui-field">
              <label>Full Name</label>
              <input
                className="ui-input"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                disabled={loading}
                required
              />
            </div>

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
                placeholder="At least 8 characters"
                disabled={loading}
                required
              />
            </div>

            <div className="ui-field">
              <label>Confirm Password</label>
              <input
                className="ui-input"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter password"
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
                {loading ? "⏳ Creating..." : "Register"}
              </button>
              <Link className="ui-btn secondary" to="/login">
                I have an account
              </Link>
            </div>

            <p className="ui-center ui-muted" style={{ marginTop: 8 }}>
              Already registered?{" "}
              <Link className="ui-link" to="/login">
                Login here
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
