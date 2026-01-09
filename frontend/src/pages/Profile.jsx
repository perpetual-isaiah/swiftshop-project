import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import axios from "axios";

const Profile = () => {
  const { user, updateUser, logout } = useAuth();

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Password change
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordMessage, setPasswordMessage] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);

  // Delete account
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const [deleteLoading, setDeleteLoading] = useState(false);

  const API_BASE_URL = "http://localhost:8000";

  const closePasswordModal = () => {
    if (passwordLoading) return;
    setShowPasswordModal(false);
    setPasswordError("");
    setPasswordMessage("");
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  const closeDeleteModal = () => {
    if (deleteLoading) return;
    setShowDeleteModal(false);
    setDeleteConfirmText("");
    setPasswordError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
      await updateUser({ name, email });
      setMessage("Profile updated successfully!");
      setIsEditing(false);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setName(user?.name || "");
    setEmail(user?.email || "");
    setIsEditing(false);
    setError("");
    setMessage("");
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setPasswordError("");
    setPasswordMessage("");

    if (newPassword.length < 6) {
      setPasswordError("New password must be at least 6 characters long");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError("New passwords do not match");
      return;
    }

    setPasswordLoading(true);

    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `${API_BASE_URL}/users/me/password`,
        { currentPassword, newPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setPasswordMessage("Password changed successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

      setTimeout(() => {
        closePasswordModal();
      }, 900);
    } catch (err) {
      setPasswordError(err.response?.data?.message || "Failed to change password");
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmText !== "DELETE") {
      setPasswordError("Please type DELETE to confirm");
      return;
    }

    setDeleteLoading(true);
    setPasswordError("");

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API_BASE_URL}/users/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      await logout();
      window.location.href = "/";
    } catch (err) {
      setPasswordError(err.response?.data?.message || "Failed to delete account");
      setDeleteLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="ui-page">
        <div className="ui-loading">
          <div className="ui-spinner" />
          <div style={{ color: "var(--muted)", fontWeight: 700 }}>Loading profile…</div>
        </div>
      </div>
    );
  }

  const firstLetter = (user?.name || "U").trim().charAt(0).toUpperCase();
  const daysSinceJoined = Math.floor(
    (new Date() - new Date(user.createdAt)) / (1000 * 60 * 60 * 24)
  );

  return (
    <div className="ui-page">
      <div className="ui-header">
        <div>
          <h1 className="ui-title">Profile</h1>
          <p className="ui-subtitle">Manage your account details and security settings.</p>
        </div>
      </div>

      {/* HERO */}
      <div className="ui-hero">
        <div className="ui-hero-row">
          <div className="ui-hero-left">
            <div className="ui-avatar">{firstLetter}</div>
            <div>
              <div className="ui-hero-name">{user.name}</div>
              <div className="ui-hero-email">{user.email}</div>
              <div className="ui-pill-row">
                <span className="ui-pill primary">{user.role === "admin" ? "Admin" : "Customer"}</span>
                <span className="ui-pill success">Active</span>
              </div>
            </div>
          </div>

          <div className="ui-toolbar">
            {!isEditing ? (
              <button className="ui-btn ui-btn-soft" onClick={() => setIsEditing(true)}>
                Edit profile
              </button>
            ) : (
              <button className="ui-btn" onClick={handleCancel} disabled={loading}>
                Cancel
              </button>
            )}
            <button className="ui-btn ui-btn-danger" onClick={() => setShowDeleteModal(true)}>
              Delete account
            </button>
          </div>
        </div>

        {/* STATS */}
        <div className="ui-stats">
          <div className="ui-stat">
            <div className="ui-stat-ic">📅</div>
            <div>
              <p className="ui-stat-kpi">{daysSinceJoined}</p>
              <p className="ui-stat-lbl">Days as member</p>
            </div>
          </div>
          <div className="ui-stat">
            <div className="ui-stat-ic">📧</div>
            <div>
              <p className="ui-stat-kpi">Verified</p>
              <p className="ui-stat-lbl">Email status</p>
            </div>
          </div>
          <div className="ui-stat">
            <div className="ui-stat-ic">🔒</div>
            <div>
              <p className="ui-stat-kpi">Secure</p>
              <p className="ui-stat-lbl">Account status</p>
            </div>
          </div>
          <div className="ui-stat">
            <div className="ui-stat-ic">🧾</div>
            <div>
              <p className="ui-stat-kpi">{user.id || user._id || "—"}</p>
              <p className="ui-stat-lbl">User ID</p>
            </div>
          </div>
        </div>
      </div>

      {/* MAIN GRID */}
      <div className="ui-grid">
        {/* Profile info */}
        <div className="ui-card ui-card-lg">
          <div className="ui-header" style={{ marginBottom: 10 }}>
            <div>
              <h2 className="ui-title" style={{ fontSize: 18, margin: 0 }}>Account details</h2>
              <p className="ui-subtitle">Keep your info up to date.</p>
            </div>
          </div>

          {message && <div className="ui-alert success" style={{ marginBottom: 12 }}>{message}</div>}
          {error && <div className="ui-alert error" style={{ marginBottom: 12 }}>{error}</div>}

          {!isEditing ? (
            <div className="ui-list">
              <div className="ui-item">
                <div>
                  <p className="ui-item-title">Full name</p>
                  <p className="ui-item-sub">{user.name}</p>
                </div>
              </div>
              <div className="ui-item">
                <div>
                  <p className="ui-item-title">Email</p>
                  <p className="ui-item-sub">{user.email}</p>
                </div>
              </div>
              <div className="ui-item">
                <div>
                  <p className="ui-item-title">Role</p>
                  <p className="ui-item-sub" style={{ textTransform: "capitalize" }}>{user.role}</p>
                </div>
                <span className="ui-badge">{user.role}</span>
              </div>
              <div className="ui-item">
                <div>
                  <p className="ui-item-title">Member since</p>
                  <p className="ui-item-sub">
                    {new Date(user.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </div>
              <div className="ui-item">
                <div>
                  <p className="ui-item-title">Last updated</p>
                  <p className="ui-item-sub">
                    {new Date(user.updatedAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <form className="ui-form" onSubmit={handleSubmit}>
              <div className="ui-field">
                <label htmlFor="name">Full name</label>
                <input
                  id="name"
                  className="ui-input"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={loading}
                  required
                  placeholder="Enter your name"
                />
              </div>

              <div className="ui-field">
                <label htmlFor="email">Email</label>
                <input
                  id="email"
                  type="email"
                  className="ui-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  required
                  placeholder="Enter your email"
                />
              </div>

              <div className="ui-row" style={{ marginTop: 6 }}>
                <button className="ui-btn ui-btn-primary" type="submit" disabled={loading}>
                  {loading ? "Saving…" : "Save changes"}
                </button>
                <button className="ui-btn" type="button" onClick={handleCancel} disabled={loading}>
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Security */}
        <div className="ui-card ui-card-lg">
          <div className="ui-header" style={{ marginBottom: 10 }}>
            <div>
              <h2 className="ui-title" style={{ fontSize: 18, margin: 0 }}>Security</h2>
              <p className="ui-subtitle">Keep your account protected.</p>
            </div>
          </div>

          <div className="ui-list">
            <div className="ui-item">
              <div>
                <p className="ui-item-title">Change password</p>
                <p className="ui-item-sub">Update your password anytime.</p>
              </div>
              <button className="ui-btn ui-btn-primary" onClick={() => setShowPasswordModal(true)}>
                Update
              </button>
            </div>

            <div className="ui-item">
              <div>
                <p className="ui-item-title">Login activity</p>
                <p className="ui-item-sub">Last login: {new Date().toLocaleDateString()}</p>
              </div>
              <span className="ui-badge">Active</span>
            </div>

            <div className="ui-item">
              <div>
                <p className="ui-item-title">Two-factor authentication</p>
                <p className="ui-item-sub">Coming soon</p>
              </div>
              <button className="ui-btn" disabled>
                Soon
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* PASSWORD MODAL */}
      {showPasswordModal && (
        <div className="ui-modal-backdrop" onClick={closePasswordModal}>
          <div className="ui-modal" onClick={(e) => e.stopPropagation()}>
            <h3>Change password</h3>
            <p>Choose a strong password you don’t reuse elsewhere.</p>

            {passwordMessage && <div className="ui-alert success">{passwordMessage}</div>}
            {passwordError && <div className="ui-alert error">{passwordError}</div>}

            <form className="ui-form" onSubmit={handlePasswordChange}>
              <div className="ui-field">
                <label>Current password</label>
                <input
                  className="ui-input"
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  disabled={passwordLoading}
                  required
                />
              </div>

              <div className="ui-field">
                <label>New password</label>
                <input
                  className="ui-input"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  disabled={passwordLoading}
                  required
                />
              </div>

              <div className="ui-field">
                <label>Confirm new password</label>
                <input
                  className="ui-input"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={passwordLoading}
                  required
                />
              </div>

              <div className="ui-row" style={{ marginTop: 6 }}>
                <button className="ui-btn ui-btn-primary" disabled={passwordLoading} type="submit">
                  {passwordLoading ? "Updating…" : "Update password"}
                </button>
                <button className="ui-btn" type="button" onClick={closePasswordModal} disabled={passwordLoading}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE MODAL */}
      {showDeleteModal && (
        <div className="ui-modal-backdrop" onClick={closeDeleteModal}>
          <div className="ui-modal" onClick={(e) => e.stopPropagation()}>
            <h3 style={{ color: "var(--danger)" }}>Delete account</h3>
            <p>This is permanent. Type <b>DELETE</b> to confirm.</p>

            {passwordError && <div className="ui-alert error">{passwordError}</div>}

            <div className="ui-field">
              <label>Type DELETE</label>
              <input
                className="ui-input"
                value={deleteConfirmText}
                onChange={(e) => setDeleteConfirmText(e.target.value)}
                disabled={deleteLoading}
                placeholder="DELETE"
              />
            </div>

            <div className="ui-row" style={{ marginTop: 12 }}>
              <button
                className="ui-btn ui-btn-danger"
                onClick={handleDeleteAccount}
                disabled={deleteLoading || deleteConfirmText !== "DELETE"}
              >
                {deleteLoading ? "Deleting…" : "Delete forever"}
              </button>
              <button className="ui-btn" onClick={closeDeleteModal} disabled={deleteLoading}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
