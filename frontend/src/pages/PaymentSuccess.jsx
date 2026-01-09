import React, { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import orderAPI from "../services/orderService";

function useQuery() {
  const { search } = useLocation();
  return useMemo(() => new URLSearchParams(search), [search]);
}

const PaymentSuccess = () => {
  const query = useQuery();
  const navigate = useNavigate();

  const orderId = query.get("orderId");
  const sessionId = query.get("session_id");

  const [status, setStatus] = useState("CHECKING");
  const [order, setOrder] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!orderId) {
      setError("Missing orderId in URL.");
      setStatus("ERROR");
      return;
    }

    let cancelled = false;

    const poll = async () => {
      try {
        setError("");
        const o = await orderAPI.getOrderById(orderId);
        if (cancelled) return;

        setOrder(o);

        if (o?.status === "PAID") {
          setStatus("PAID");
          setTimeout(() => {
            navigate("/orders?success=1", { replace: true });
          }, 2500);
          return;
        }

        setStatus("PENDING");
      } catch (e) {
        if (cancelled) return;
        setError("Could not load order. Please refresh.");
        setStatus("ERROR");
      }
    };

    poll();
    const interval = setInterval(poll, 2000);

    const timeout = setTimeout(() => {
      clearInterval(interval);
      if (!cancelled) setStatus((prev) => (prev === "PAID" ? "PAID" : "PENDING"));
    }, 20000);

    return () => {
      cancelled = true;
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [orderId, navigate]);

  return (
    <div className="ui-shell">
      <div className="payment-success-container">
        {/* Success Animation Card */}
        <div className="payment-success-card">
          {status === "CHECKING" && (
            <div className="payment-status">
              <div className="payment-spinner"></div>
              <h2>Processing Payment</h2>
              <p className="ui-muted">Verifying your transaction...</p>
            </div>
          )}

          {status === "PENDING" && (
            <div className="payment-status">
              <div className="payment-icon pending">
                <div className="pulse-ring"></div>
                <div className="pulse-ring pulse-ring-delay"></div>
                ⏳
              </div>
              <h2>Payment Received!</h2>
              <p className="ui-muted">Confirming your order... This usually takes a few seconds.</p>
            </div>
          )}

          {status === "PAID" && (
            <div className="payment-status">
              <div className="payment-icon success">
                <div className="checkmark-circle">
                  <svg viewBox="0 0 52 52" className="checkmark">
                    <circle className="checkmark-circle-path" cx="26" cy="26" r="25" fill="none" />
                    <path className="checkmark-check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" />
                  </svg>
                </div>
              </div>
              <h2 style={{ color: '#10b981' }}>Payment Successful!</h2>
              <p className="ui-muted">Your order has been confirmed. Redirecting to orders...</p>
            </div>
          )}

          {status === "ERROR" && (
            <div className="payment-status">
              <div className="payment-icon error">❌</div>
              <h2 style={{ color: '#ef4444' }}>Something Went Wrong</h2>
              <p className="ui-muted">{error}</p>
            </div>
          )}

          {/* Order Details Card */}
          {order && (
            <div className="order-summary-card">
              <h3>📦 Order Summary</h3>
              <div className="order-details">
                <div className="order-detail-row">
                  <span className="detail-label">Order ID</span>
                  <span className="detail-value">#{order.id}</span>
                </div>
                <div className="order-detail-row">
                  <span className="detail-label">Total Amount</span>
                  <span className="detail-value total">${Number(order.totalAmount ?? 0).toFixed(2)}</span>
                </div>
                <div className="order-detail-row">
                  <span className="detail-label">Status</span>
                  <span className={`detail-value status ${order.status.toLowerCase()}`}>
                    {order.status === "PAID" && "✓ "}
                    {order.status}
                  </span>
                </div>
                {sessionId && (
                  <div className="order-detail-row">
                    <span className="detail-label">Session ID</span>
                    <span className="detail-value session">{sessionId.slice(0, 30)}...</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="payment-actions">
            <Link className="ui-btn primary large" to="/orders">
              📋 View My Orders
            </Link>
            <Link className="ui-btn secondary large" to="/products">
              🛍️ Continue Shopping
            </Link>
          </div>
        </div>
      </div>

      <style jsx>{`
        .payment-success-container {
          min-height: 80vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem 1rem;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }

        .payment-success-card {
          background: white;
          border-radius: 20px;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
          max-width: 500px;
          width: 100%;
          padding: 3rem 2rem;
          animation: slideUp 0.5s ease-out;
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .payment-status {
          text-align: center;
          margin-bottom: 2rem;
        }

        .payment-status h2 {
          font-size: 1.8rem;
          font-weight: 700;
          margin: 1rem 0 0.5rem;
          color: #1f2937;
        }

        .payment-status p {
          font-size: 1rem;
          margin: 0;
        }

        .payment-icon {
          font-size: 4rem;
          margin-bottom: 1rem;
          position: relative;
          display: inline-block;
        }

        .payment-icon.pending {
          animation: bounce 2s infinite;
        }

        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }

        .pulse-ring {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 100px;
          height: 100px;
          border: 3px solid #fbbf24;
          border-radius: 50%;
          animation: pulse 2s ease-out infinite;
        }

        .pulse-ring-delay {
          animation-delay: 1s;
        }

        @keyframes pulse {
          0% {
            transform: translate(-50%, -50%) scale(0.5);
            opacity: 1;
          }
          100% {
            transform: translate(-50%, -50%) scale(1.5);
            opacity: 0;
          }
        }

        .payment-spinner {
          border: 4px solid #e5e7eb;
          border-top: 4px solid #667eea;
          border-radius: 50%;
          width: 60px;
          height: 60px;
          animation: spin 1s linear infinite;
          margin: 0 auto;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .checkmark-circle {
          width: 80px;
          height: 80px;
          margin: 0 auto;
        }

        .checkmark {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          stroke-width: 3;
          stroke: #10b981;
          stroke-miterlimit: 10;
          animation: fill 0.4s ease-in-out 0.4s forwards, scale 0.3s ease-in-out 0.9s both;
        }

        .checkmark-circle-path {
          stroke-dasharray: 166;
          stroke-dashoffset: 166;
          stroke-width: 3;
          stroke: #10b981;
          animation: stroke 0.6s cubic-bezier(0.65, 0, 0.45, 1) forwards;
        }

        .checkmark-check {
          transform-origin: 50% 50%;
          stroke-dasharray: 48;
          stroke-dashoffset: 48;
          animation: stroke 0.3s cubic-bezier(0.65, 0, 0.45, 1) 0.8s forwards;
        }

        @keyframes stroke {
          100% { stroke-dashoffset: 0; }
        }

        @keyframes scale {
          0%, 100% { transform: none; }
          50% { transform: scale3d(1.1, 1.1, 1); }
        }

        @keyframes fill {
          100% { box-shadow: inset 0 0 0 30px #10b981; }
        }

        .order-summary-card {
          background: #f9fafb;
          border-radius: 12px;
          padding: 1.5rem;
          margin-bottom: 2rem;
        }

        .order-summary-card h3 {
          font-size: 1.2rem;
          font-weight: 700;
          margin: 0 0 1rem 0;
          color: #1f2937;
        }

        .order-details {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .order-detail-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.5rem 0;
          border-bottom: 1px solid #e5e7eb;
        }

        .order-detail-row:last-child {
          border-bottom: none;
        }

        .detail-label {
          font-weight: 500;
          color: #6b7280;
          font-size: 0.9rem;
        }

        .detail-value {
          font-weight: 600;
          color: #1f2937;
          font-size: 0.95rem;
        }

        .detail-value.total {
          color: #667eea;
          font-size: 1.3rem;
        }

        .detail-value.status {
          padding: 0.25rem 0.75rem;
          border-radius: 20px;
          font-size: 0.85rem;
          font-weight: 700;
          text-transform: uppercase;
        }

        .detail-value.status.created {
          background: #fef3c7;
          color: #92400e;
        }

        .detail-value.status.paid {
          background: #d1fae5;
          color: #065f46;
        }

        .detail-value.session {
          font-family: monospace;
          font-size: 0.75rem;
          color: #9ca3af;
        }

        .payment-actions {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .ui-btn.large {
          padding: 1rem;
          font-size: 1rem;
          font-weight: 600;
          border-radius: 10px;
          transition: all 0.3s ease;
        }

        .ui-btn.primary.large {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
        }

        .ui-btn.primary.large:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(102, 126, 234, 0.6);
        }

        .ui-btn.secondary.large {
          background: white;
          border: 2px solid #e5e7eb;
          color: #4b5563;
        }

        .ui-btn.secondary.large:hover {
          background: #f9fafb;
          border-color: #d1d5db;
          transform: translateY(-2px);
        }

        @media (max-width: 640px) {
          .payment-success-card {
            padding: 2rem 1.5rem;
          }

          .payment-status h2 {
            font-size: 1.5rem;
          }

          .payment-icon {
            font-size: 3rem;
          }
        }
      `}</style>
    </div>
  );
};

export default PaymentSuccess;