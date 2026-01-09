import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import orderAPI from "../services/orderService";

const Cart = () => {
  const navigate = useNavigate();

  const {
    cartItems,
    cartTotal,
    cartCount,
    updateQuantity,
    removeFromCart,
    clearCart,
  } = useCart();

  const { user, isAuthenticated } = useAuth();

  const [checkingOut, setCheckingOut] = useState(false);
  const [error, setError] = useState("");

  const lineItems = useMemo(() => {
  console.log("🛒 Cart items:", cartItems); // 🔍 Debug
  
  return cartItems.map((item) => {
    const productName =
      item?.name || item?.productName || item?.title || "Unknown Product";

    const lineItem = {
      productId: Number(item?.id ?? 0),
      productName,
      unitPrice: Number(item?.price ?? 0),
      quantity: Number(item?.quantity ?? 1),
    };
    
    console.log("📦 Line item:", lineItem); // 🔍 Debug
    
    return lineItem;
  });
}, [cartItems]);
  const handleCheckout = async () => {
    try {
      setError("");

      const userId = user?.id || user?._id;

      if (!isAuthenticated || !userId) {
        setError("Please login first to proceed to checkout.");
        return;
      }

      if (!cartItems.length) {
        setError("Your cart is empty.");
        return;
      }

      // Extra guard before calling backend
      const badItem = lineItems.find((x) => !x.productName || x.productName === "Unknown Product");
      if (badItem) {
        setError("One product in your cart is missing a name. Please remove it and add again.");
        return;
      }

      setCheckingOut(true);

      // 1) Create order with all required fields ✅
      const orderPayload = {
        userId,
        items: lineItems,
        totalAmount: cartTotal,  // ✅ ADDED: Include total amount
      };

      console.log("📦 Creating order:", orderPayload); // 🔍 Debug log

      const order = await orderAPI.createOrder(orderPayload);

      console.log("✅ Order created:", order); // 🔍 Debug log
      console.log("📋 Items in order:", order.items); // 🔍 Debug log

      if (!order?.id) {
        throw new Error("Order was created but no ID was returned.");
      }

      // 2) Clear cart after successful order creation ✅
      clearCart();

      // 3) Navigate to orders (Pay Now triggers Stripe)
      navigate("/orders");
    } catch (err) {
      console.error("❌ Checkout error:", err);
      setError(
        err?.response?.data?.message ||
          err?.response?.data?.error ||
          err?.message ||
          "Failed to create order."
      );
    } finally {
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

          <Link
            to="/products"
            className="btn btn-primary"
            style={{ marginTop: "1.5rem" }}
          >
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
                <div style={{ fontWeight: 800, color: "#2c3e50" }}>
                  {item.name || item.productName || item.title || "Unknown Product"}
                </div>
                <div style={{ color: "#7f8c8d", marginTop: "0.2rem" }}>
                  ${Number(item.price).toFixed(2)} each
                </div>

                {/* Quantity controls */}
                <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.75rem" }}>
                  <button
                    className="btn btn-secondary"
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
                    disabled={checkingOut}
                  />

                  <button
                    className="btn btn-secondary"
                    onClick={() => updateQuantity(item.id, Number(item.quantity) + 1)}
                    disabled={checkingOut}
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Right side */}
              <div style={{ textAlign: "right" }}>
                <div style={{ fontWeight: 900 }}>
                  ${(Number(item.price) * Number(item.quantity)).toFixed(2)}
                </div>

                <button
                  className="btn btn-danger"
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
            flexWrap: "wrap",
            gap: "1rem",
          }}
        >
          <button className="btn btn-secondary" onClick={clearCart} disabled={checkingOut}>
            Clear Cart
          </button>

          <div style={{ textAlign: "right" }}>
            <div>Total</div>
            <div style={{ fontSize: "2rem", fontWeight: 900 }}>
              ${cartTotal.toFixed(2)}
            </div>
          </div>

          <button className="btn btn-success" onClick={handleCheckout} disabled={checkingOut}>
            {checkingOut ? "Creating order..." : "Proceed to Checkout"}
          </button>
        </div>
      </div>

      <div className="card">
        <Link to="/orders" className="btn btn-primary">
          Go to Orders
        </Link>
      </div>
    </div>
  );
};

export default Cart;