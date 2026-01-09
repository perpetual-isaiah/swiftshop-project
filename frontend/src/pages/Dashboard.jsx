import React, { useEffect, useMemo, useState } from "react";
import { useAuth } from "../context/AuthContext";
import axios from "axios";

const Dashboard = () => {
  const { user, updateUser } = useAuth();

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);

  const API_BASE_URL = "http://localhost:8000";

  const extractOrdersArray = (payload) => {
    if (Array.isArray(payload)) return payload;
    if (payload && Array.isArray(payload.orders)) return payload.orders;
    if (payload && Array.isArray(payload.data)) return payload.data;
    if (payload?.data && Array.isArray(payload.data.orders)) return payload.data.orders;
    return [];
  };

  const toNumber = (v) => {
    const n = typeof v === "string" ? parseFloat(v) : Number(v);
    return Number.isFinite(n) ? n : 0;
  };

  const normalizeOrder = (o) => {
    const total =
      o?.totalAmount ??
      o?.total_amount ??
      o?.total ??
      o?.totalPrice ??
      o?.total_price ??
      0;

    const created =
      o?.createdAt ??
      o?.created_at ??
      o?.createdOn ??
      o?.dateCreated ??
      o?.created_date ??
      null;

    return {
      id: o?.id ?? o?.orderId ?? o?._id,
      status: (o?.status ?? o?.paymentStatus ?? "UNKNOWN").toString(),
      createdAt: created ? new Date(created).toISOString() : null,
      totalAmount: toNumber(total),
      items: Array.isArray(o?.items) ? o.items : (Array.isArray(o?.orderItems) ? o.orderItems : []),
      raw: o,
    };
  };

  useEffect(() => {
    const fetchOrders = async () => {
      const userId = user?.id || user?._id;
      if (!userId) return;

      try {
        setOrdersLoading(true);
        const token = localStorage.getItem("token");

        // If your gateway does NOT require auth for this route, you can remove headers safely.
        const res = await axios.get(`${API_BASE_URL}/orders/user/${userId}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        });

        const arr = extractOrdersArray(res.data);
        const normalized = arr.map(normalizeOrder);

        // Sort newest first so "Recent orders" is correct
        normalized.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));

        setOrders(normalized);
      } catch (err) {
        console.error("Failed to fetch orders:", err?.response?.data || err);
        setOrders([]);
      } finally {
        setOrdersLoading(false);
      }
    };

    fetchOrders();
  }, [user]);

  const totalOrders = orders.length;

  const totalSpent = useMemo(() => {
    const paidStatuses = new Set(["PAID", "COMPLETED", "SUCCESS"]);
    return orders.reduce((sum, o) => {
      const isPaid = paidStatuses.has((o.status || "").toUpperCase());
      return sum + (isPaid ? (o.totalAmount || 0) : 0);
    }, 0);
  }, [orders]);

  // Use latest 4 orders (not just first 4 from backend)
  const recentOrders = useMemo(() => orders.slice(0, 4), [orders]);

  // "Recent items" KPI — count items from the recentOrders list
  const recentItemsCount = useMemo(() => {
    return recentOrders.reduce((count, o) => count + (Array.isArray(o.items) ? o.items.length : 0), 0);
  }, [recentOrders]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setSaving(true);

    try {
      await updateUser({ name, email });
      setMessage("Profile updated successfully!");
      setIsEditing(false);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setName(user?.name || "");
    setEmail(user?.email || "");
    setIsEditing(false);
    setError("");
    setMessage("");
  };

  if (!user) {
    return (
      <div className="ui-page">
        <div className="ui-loading">
          <div className="ui-spinner" />
          <div style={{ color: "var(--muted)", fontWeight: 700 }}>Loading…</div>
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
          <h1 className="ui-title">Dashboard</h1>
          <p className="ui-subtitle">A quick snapshot of your account and orders.</p>
        </div>

        <div className="ui-toolbar">
          <button
            className="ui-btn ui-btn-soft"
            onClick={() => (window.location.href = "/products")}
            type="button"
          >
            Browse products
          </button>
          <button
            className="ui-btn ui-btn-primary"
            onClick={() => (window.location.href = "/orders")}
            type="button"
          >
            View orders
          </button>
        </div>
      </div>

      <div className="ui-hero">
        <div className="ui-hero-row">
          <div className="ui-hero-left">
            <div className="ui-avatar">{firstLetter}</div>
            <div>
              <div className="ui-hero-name">Welcome back, {user.name}</div>
              <div className="ui-hero-email">{user.email}</div>
              <div className="ui-pill-row">
                <span className="ui-pill primary">
                  {user.role === "admin" ? "Admin" : "Customer"}
                </span>
                <span className="ui-pill success">{daysSinceJoined} days member</span>
              </div>
            </div>
          </div>

          <div className="ui-toolbar">
            <span className="ui-pill">Services: OK</span>
          </div>
        </div>

        <div className="ui-stats">
          <div className="ui-stat">
            <div className="ui-stat-ic">🛒</div>
            <div>
              <p className="ui-stat-kpi">{ordersLoading ? "…" : totalOrders}</p>
              <p className="ui-stat-lbl">Orders placed</p>
            </div>
          </div>

          <div className="ui-stat">
            <div className="ui-stat-ic">💳</div>
            <div>
              <p className="ui-stat-kpi">{ordersLoading ? "…" : `$${totalSpent.toFixed(2)}`}</p>
              <p className="ui-stat-lbl">Total spent</p>
            </div>
          </div>

          <div className="ui-stat">
            <div className="ui-stat-ic">✨</div>
            <div>
              <p className="ui-stat-kpi">Active</p>
              <p className="ui-stat-lbl">Account status</p>
            </div>
          </div>

          <div className="ui-stat">
            <div className="ui-stat-ic">📦</div>
            <div>
              <p className="ui-stat-kpi">{ordersLoading ? "…" : recentItemsCount}</p>
              <p className="ui-stat-lbl">Recent items</p>
            </div>
          </div>
        </div>
      </div>

      <div className="ui-grid">
        {/* Profile quick edit */}
        <div className="ui-card ui-card-lg">
          <div className="ui-header" style={{ marginBottom: 10 }}>
            <div>
              <h2 className="ui-title" style={{ fontSize: 18, margin: 0 }}>Profile</h2>
              <p className="ui-subtitle">Edit your details quickly.</p>
            </div>

            {!isEditing ? (
              <button className="ui-btn ui-btn-soft" onClick={() => setIsEditing(true)} type="button">
                Edit
              </button>
            ) : (
              <button className="ui-btn" onClick={handleCancel} disabled={saving} type="button">
                Cancel
              </button>
            )}
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
            </div>
          ) : (
            <form className="ui-form" onSubmit={handleSubmit}>
              <div className="ui-field">
                <label>Full name</label>
                <input
                  className="ui-input"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={saving}
                  required
                />
              </div>
              <div className="ui-field">
                <label>Email</label>
                <input
                  type="email"
                  className="ui-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={saving}
                  required
                />
              </div>
              <div className="ui-row" style={{ marginTop: 6 }}>
                <button className="ui-btn ui-btn-primary" disabled={saving} type="submit">
                  {saving ? "Saving…" : "Save"}
                </button>
                <button className="ui-btn" type="button" onClick={handleCancel} disabled={saving}>
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Recent orders */}
        <div className="ui-card ui-card-lg">
          <div className="ui-header" style={{ marginBottom: 10 }}>
            <div>
              <h2 className="ui-title" style={{ fontSize: 18, margin: 0 }}>Recent orders</h2>
              <p className="ui-subtitle">Your latest activity.</p>
            </div>
          </div>

          {ordersLoading ? (
            <div className="ui-loading">
              <div className="ui-spinner" />
              <div style={{ color: "var(--muted)", fontWeight: 700 }}>Loading orders…</div>
            </div>
          ) : orders.length === 0 ? (
            <div className="ui-alert warn">
              No orders yet. Start shopping to see your activity here.
            </div>
          ) : (
            <div className="ui-list">
              {recentOrders.map((o) => {
                const statusUpper = (o.status || "").toUpperCase();
                const paid = statusUpper === "PAID";
                const label = paid ? "PAID" : statusUpper;

                return (
                  <div className="ui-item" key={o.id}>
                    <div>
                      <p className="ui-item-title">Order #{o.id}</p>
                      <p className="ui-item-sub">
                        {o.createdAt ? new Date(o.createdAt).toLocaleDateString() : "—"} • $
                        {Number(o.totalAmount ?? 0).toFixed(2)}
                        {Array.isArray(o.items) && o.items.length > 0
                          ? ` • ${o.items.length} item${o.items.length > 1 ? "s" : ""}`
                          : ""}
                      </p>
                    </div>
                    <span className={`ui-badge ${paid ? "paid" : "unpaid"}`}>
                      {label}
                    </span>
                  </div>
                );
              })}
            </div>
          )}

          <div className="ui-row" style={{ marginTop: 12 }}>
            <button className="ui-btn ui-btn-soft" onClick={() => (window.location.href = "/orders")} type="button">
              View all orders
            </button>
            <button className="ui-btn" onClick={() => (window.location.href = "/profile")} type="button">
              Go to profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
