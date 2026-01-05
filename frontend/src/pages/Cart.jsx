import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

const Cart = () => {
  const { cartItems, cartTotal, cartCount, updateQuantity, removeFromCart, clearCart } = useCart();
  const { isAuthenticated } = useAuth();

  const [checkingOut, setCheckingOut] = useState(false);
  const [error, setError] = useState("");

  // Use your env if you have it, otherwise fallback to localhost gateway
  const API_BASE =
    process.env.REACT_APP_API_URL?.replace(/\/$/, "") || "http://localhost:8000";

  // Change this if your gateway uses a different path
  const CHECKOUT_ENDPOINT = "/checkout/create-session";

  const lineItems = useMemo(() => {
    // Keep it simple + Stripe-friendly
    return cartItems.map((item) => ({
      id: item.id,
      name: item.name,
      price: Number(item.price), // numeric
      quantity: Number(item.quantity),
      image: item.image || null,
    }));
  }, [cartItems]);

  const handleCheckout = async () => {
    try {
      setError("");

      if (!isAuthenticated) {
        setError("Please login first to proceed to checkout.");
        return;
      }

      if (!cartItems.length) {
        setError("Your cart is empty.");
        return;
      }

      setCheckingOut(true);

      // For Stripe redirect URLs
      // Stripe needs absolute URLs; this is your frontend origin
      const origin = window.location.origin;

      const response = await axios.post(
        `${API_BASE}${CHECKOUT_ENDPOINT}`,
        {
          items: lineItems,
          // optional, but super useful on backend:
          totalAmount: Number(cartTotal.toFixed(2)),
          currency: "usd",
          successUrl: `${origin}/orders?success=1`,
          cancelUrl: `${origin}/cart?canceled=1`,
        },
        {
          headers: {
            // if you protect gateway endpoints
            Authorization: localStorage.getItem("token")
              ? `Bearer ${localStorage.getItem("token")}`
              : undefined,
          },
        }
      );

      const url = response.data?.url;

      if (!url) {
        setError("Checkout session created but no redirect URL was returned.");
        setCheckingOut(false);
        return;
      }

      // Redirect to Stripe Checkout
      window.location.href = url;
    } catch (err) {
      console.error("Checkout error:", err);
      setError(
        err?.response?.data?.message ||
          err?.response?.data?.error ||
          "Failed to start checkout. Check your gateway Stripe endpoint."
      );
      setCheckingOut(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="card">
        <div className="card-header">
          <h2>🛒 Your Cart</h2>
          <p>Your cart is empty</p>
        </div>

        <div className="empty-state" style={{ padding: "3rem 1rem" }}>
          <div className="empty-icon">🛍️</div>
          <h3>Nothing here yet</h3>
          <p>Add products to your cart to see them here.</p>

          <Link to="/products" className="btn btn-primary" style={{ marginTop: "1.5rem" }}>
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="card">
        <div className="card-header">
          <h2>🛒 Your Cart</h2>
          <p>
            {cartCount} item{cartCount !== 1 ? "s" : ""} in cart
          </p>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        {/* Cart Items */}
        <div style={{ display: "grid", gap: "1rem" }}>
          {cartItems.map((item) => (
            <div
              key={item.id}
              style={{
                display: "grid",
                gridTemplateColumns: "80px 1fr auto",
                gap: "1rem",
                alignItems: "center",
                background: "white",
                borderRadius: "14px",
                padding: "1rem",
                boxShadow: "0 4px 15px rgba(0, 0, 0, 0.06)",
              }}
            >
              {/* Image */}
              <div
                style={{
                  width: "80px",
                  height: "80px",
                  borderRadius: "12px",
                  overflow: "hidden",
                  background:
                    "linear-gradient(135deg, rgba(102,126,234,0.15) 0%, rgba(118,75,162,0.15) 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "2rem",
                }}
              >
                {item.image ? (
                  <img
                    src={item.image}
                    alt={item.name}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                ) : (
                  "📦"
                )}
              </div>

              {/* Details */}
              <div>
                <div style={{ fontWeight: 800, color: "#2c3e50" }}>{item.name}</div>
                <div style={{ color: "#7f8c8d", marginTop: "0.2rem" }}>
                  ${Number(item.price).toFixed(2)} each
                </div>

                {/* Quantity controls */}
                <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.75rem" }}>
                  <button
                    className="btn btn-secondary"
                    style={{ padding: "0.45rem 1rem" }}
                    onClick={() =>
                      updateQuantity(item.id, Math.max(1, Number(item.quantity) - 1))
                    }
                    disabled={checkingOut}
                  >
                    −
                  </button>

                  <input
                    value={item.quantity}
                    onChange={(e) => {
                      const next = Number(e.target.value);
                      updateQuantity(item.id, Number.isFinite(next) ? Math.max(1, next) : 1);
                    }}
                    type="number"
                    min="1"
                    style={{
                      width: "70px",
                      padding: "0.55rem 0.7rem",
                      borderRadius: "12px",
                      border: "2px solid #e0e0e0",
                      fontWeight: 700,
                      textAlign: "center",
                    }}
                    disabled={checkingOut}
                  />

                  <button
                    className="btn btn-secondary"
                    style={{ padding: "0.45rem 1rem" }}
                    onClick={() => updateQuantity(item.id, Number(item.quantity) + 1)}
                    disabled={checkingOut}
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Right side */}
              <div style={{ textAlign: "right" }}>
                <div style={{ fontWeight: 900, fontSize: "1.1rem", color: "#2c3e50" }}>
                  ${(Number(item.price) * Number(item.quantity)).toFixed(2)}
                </div>

                <button
                  className="btn btn-danger"
                  style={{ padding: "0.55rem 1rem", marginTop: "0.7rem" }}
                  onClick={() => removeFromCart(item.id)}
                  disabled={checkingOut}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div
          style={{
            marginTop: "2rem",
            paddingTop: "1.5rem",
            borderTop: "2px solid #f0f0f0",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "1rem",
            flexWrap: "wrap",
          }}
        >
          <button className="btn btn-secondary" onClick={clearCart} disabled={checkingOut}>
            Clear Cart
          </button>

          <div style={{ textAlign: "right" }}>
            <div style={{ color: "#7f8c8d", fontWeight: 700 }}>Total</div>
            <div style={{ fontSize: "2rem", fontWeight: 900, color: "#2c3e50" }}>
              ${cartTotal.toFixed(2)}
            </div>
          </div>

          <button
            className="btn btn-success"
            style={{ width: "260px", opacity: checkingOut ? 0.7 : 1 }}
            onClick={handleCheckout}
            disabled={checkingOut}
          >
            {checkingOut ? "Redirecting..." : "Proceed to Checkout"}
          </button>
        </div>
      </div>

      <div className="card" style={{ background: "rgba(255,255,255,0.92)" }}>
        <div style={{ display: "flex", alignItems: "start", gap: "1rem" }}>
          <div style={{ fontSize: "2rem" }}>🔒</div>
          <div>
            <h3 style={{ color: "#2c3e50", marginBottom: "0.5rem" }}>Stripe Checkout</h3>
            <p style={{ color: "#7f8c8d", marginBottom: "0.8rem" }}>
              Clicking “Proceed to Checkout” will create a Stripe Checkout Session through the API Gateway and redirect you to Stripe.
            </p>
            <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
              <Link to="/products" className="btn btn-secondary">
                Continue Shopping
              </Link>
              <Link to="/orders" className="btn btn-primary">
                Go to Orders
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
