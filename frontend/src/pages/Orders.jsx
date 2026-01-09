import React, { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import orderAPI from "../services/orderService";
import { useAuth } from "../context/AuthContext";

const Orders = () => {
  const { user } = useAuth();
  const { search } = useLocation();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [payingOrderId, setPayingOrderId] = useState(null);
  const [error, setError] = useState("");

  const userId = user?.id || user?._id;

  const query = useMemo(() => new URLSearchParams(search), [search]);
  const success = query.get("success") === "1";
  const canceled = query.get("canceled") === "1";

  useEffect(() => {
    if (userId) loadOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  useEffect(() => {
    if (!success) return;

    let tries = 0;
    const interval = setInterval(() => {
      tries += 1;
      loadOrders();
      if (tries >= 6) clearInterval(interval);
    }, 2000);

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [success]);

  const loadOrders = async () => {
    try {
      setError("");
      setLoading(true);
      const data = await orderAPI.getOrdersByUser(userId);
      setOrders(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setError("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  const handlePay = async (orderId) => {
    try {
      setPayingOrderId(orderId);
      const paymentResponse = await orderAPI.payOrder(orderId);
      const checkoutUrl = paymentResponse?.url;

      if (!checkoutUrl) throw new Error("No Stripe checkout URL returned from backend.");
      window.location.href = checkoutUrl;
    } catch (err) {
      console.error(err);
      alert("Payment failed");
      setPayingOrderId(null);
    }
  };

  const unpaidOrders = orders.filter((o) => ["CREATED", "PENDING_PAYMENT"].includes(o.status));
  const paidOrders = orders.filter((o) => o.status === "PAID");

  return (
    <div className="ui-shell">
      <div className="ui-card">
        <div className="ui-card-header">
          <div>
            <h2>📦 My Orders</h2>
            <p className="ui-muted">Track payments and see what you ordered.</p>
          </div>
          <button className="ui-btn secondary" onClick={loadOrders} type="button">
            🔄 Refresh
          </button>
        </div>

        {success && <div className="ui-alert success">✅ Payment completed! Updating your orders…</div>}
        {canceled && <div className="ui-alert error">⚠️ Payment canceled. Your order is still unpaid.</div>}
        {error && <div className="ui-alert error">❌ {error}</div>}

        <div className="ui-card-body">
          {loading ? (
            <div className="ui-center ui-muted" style={{ padding: 18 }}>
              ⏳ Loading orders...
            </div>
          ) : (
            <div className="orders-columns">
              {/* UNPAID */}
              <div className="order-panel">
                <div className="order-panel-head">
                  <h3>🕒 Unpaid Orders</h3>
                  <span className="badge warning">{unpaidOrders.length}</span>
                </div>

                {unpaidOrders.length === 0 ? (
                  <div className="ui-center ui-muted" style={{ padding: 14 }}>
                    No unpaid orders.
                  </div>
                ) : (
                  unpaidOrders.map((order) => (
                    <div className="order-card" key={order.id}>
                      <div className="order-top">
                        <div>
                          <div className="order-id">Order #{order.id}</div>
                          <div className="order-total">
                            ${Number(order.totalAmount ?? 0).toFixed(2)}
                          </div>
                        </div>
                        <span className="badge warning">{order.status}</span>
                      </div>

                      {Array.isArray(order.items) && order.items.length > 0 ? (
                        <div className="order-items">
                          {order.items.map((item, idx) => (
                            <div className="order-item" key={idx}>
                              <span>
                                <strong>{item.productName || "Unknown Product"}</strong>{" "}
                                <span className="ui-muted">× {item.quantity || 1}</span>
                              </span>
                              <span style={{ fontWeight: 900 }}>
                                $
                                {Number(
                                  item.subtotal ?? (item.unitPrice * item.quantity) ?? 0
                                ).toFixed(2)}
                              </span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="ui-alert error" style={{ margin: "10px 0 0" }}>
                          ⚠️ No items found for this order
                        </div>
                      )}

                      <div style={{ marginTop: 10 }}>
                        <button
                          className="ui-btn primary"
                          onClick={() => handlePay(order.id)}
                          disabled={payingOrderId === order.id}
                          type="button"
                          style={{ width: "100%" }}
                        >
                          {payingOrderId === order.id ? "Redirecting..." : "💳 Pay Now"}
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* PAID */}
              <div className="order-panel">
                <div className="order-panel-head">
                  <h3>✅ Paid Orders</h3>
                  <span className="badge success">{paidOrders.length}</span>
                </div>

                {paidOrders.length === 0 ? (
                  <div className="ui-center ui-muted" style={{ padding: 14 }}>
                    No paid orders yet.
                  </div>
                ) : (
                  paidOrders.map((order) => (
                    <div className="order-card" key={order.id}>
                      <div className="order-top">
                        <div>
                          <div className="order-id">Order #{order.id}</div>
                          <div className="order-total">
                            ${Number(order.totalAmount ?? 0).toFixed(2)}
                          </div>
                        </div>
                        <span className="badge success">PAID</span>
                      </div>

                      {Array.isArray(order.items) && order.items.length > 0 ? (
                        <div className="order-items">
                          {order.items.map((item, idx) => (
                            <div className="order-item" key={idx}>
                              <span>
                                <strong>{item.productName || "Unknown Product"}</strong>{" "}
                                <span className="ui-muted">× {item.quantity || 1}</span>
                              </span>
                              <span style={{ fontWeight: 900 }}>
                                $
                                {Number(
                                  item.subtotal ?? (item.unitPrice * item.quantity) ?? 0
                                ).toFixed(2)}
                              </span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="ui-alert error" style={{ margin: "10px 0 0" }}>
                          ⚠️ No items found for this order
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Orders;
