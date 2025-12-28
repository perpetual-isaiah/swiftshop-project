import express, { Request, Response, NextFunction } from "express";
import axios from "axios";
import cors from "cors";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Service URLs
const USER_SERVICE = "http://localhost:3001";
const PRODUCT_SERVICE = "http://localhost:5000";
const ORDER_SERVICE = "http://localhost:8082"; // Updated to actual port

// Health check
app.get("/", (req, res) => {
  res.json({
    service: "SwiftShop API Gateway",
    status: "running",
    version: "1.0.0",
    services: {
      user: USER_SERVICE,
      product: PRODUCT_SERVICE,
      order: ORDER_SERVICE
    }
  });
});

app.get("/health", (req, res) => {
  res.json({ success: true, status: "API Gateway is healthy" });
});

// ==========================================
// USER SERVICE ROUTES
// ==========================================

// Public routes
app.post("/auth/register", async (req, res) => {
  try {
    const response = await axios.post(`${USER_SERVICE}/api/users/register`, req.body);
    res.status(response.status).json(response.data);
  } catch (error: any) {
    res.status(error.response?.status || 500).json(
      error.response?.data || { success: false, error: "User Service error" }
    );
  }
});

app.post("/auth/login", async (req, res) => {
  try {
    const response = await axios.post(`${USER_SERVICE}/api/users/login`, req.body);
    res.status(response.status).json(response.data);
  } catch (error: any) {
    res.status(error.response?.status || 500).json(
      error.response?.data || { success: false, error: "User Service error" }
    );
  }
});

// Protected routes - forward with auth header
app.get("/users/me", async (req, res) => {
  try {
    const response = await axios.get(`${USER_SERVICE}/api/users/me`, {
      headers: { Authorization: req.headers.authorization }
    });
    res.json(response.data);
  } catch (error: any) {
    res.status(error.response?.status || 500).json(
      error.response?.data || { success: false, error: "User Service error" }
    );
  }
});

app.put("/users/me", async (req, res) => {
  try {
    const response = await axios.put(`${USER_SERVICE}/api/users/me`, req.body, {
      headers: { Authorization: req.headers.authorization }
    });
    res.json(response.data);
  } catch (error: any) {
    res.status(error.response?.status || 500).json(
      error.response?.data || { success: false, error: "User Service error" }
    );
  }
});

app.post("/users/logout", async (req, res) => {
  try {
    const response = await axios.post(`${USER_SERVICE}/api/users/logout`, {}, {
      headers: { Authorization: req.headers.authorization }
    });
    res.json(response.data);
  } catch (error: any) {
    res.status(error.response?.status || 500).json(
      error.response?.data || { success: false, error: "User Service error" }
    );
  }
});

app.get("/users", async (req, res) => {
  try {
    const response = await axios.get(`${USER_SERVICE}/api/users`, {
      headers: { Authorization: req.headers.authorization }
    });
    res.json(response.data);
  } catch (error: any) {
    res.status(error.response?.status || 500).json(
      error.response?.data || { success: false, error: "User Service error" }
    );
  }
});

// ==========================================
// ORDER SERVICE ROUTES - NOW ACTIVE! ✅
// ==========================================

// Create order
app.post("/orders", async (req, res) => {
  try {
    const response = await axios.post(`${ORDER_SERVICE}/api/orders`, req.body, {
      headers: { Authorization: req.headers.authorization }
    });
    res.status(response.status).json(response.data);
  } catch (error: any) {
    if (error.code === 'ECONNREFUSED') {
      return res.status(503).json({
        success: false,
        message: "Order Service is not running. Please start it on port 8082"
      });
    }
    res.status(error.response?.status || 500).json(
      error.response?.data || { success: false, error: "Order Service error" }
    );
  }
});

// Get order by ID
app.get("/orders/:id", async (req, res) => {
  try {
    const response = await axios.get(`${ORDER_SERVICE}/api/orders/${req.params.id}`, {
      headers: { Authorization: req.headers.authorization }
    });
    res.json(response.data);
  } catch (error: any) {
    if (error.code === 'ECONNREFUSED') {
      return res.status(503).json({
        success: false,
        message: "Order Service is not running. Please start it on port 8082"
      });
    }
    res.status(error.response?.status || 500).json(
      error.response?.data || { success: false, error: "Order Service error" }
    );
  }
});

// Get orders by user ID
app.get("/orders/user/:userId", async (req, res) => {
  try {
    const response = await axios.get(`${ORDER_SERVICE}/api/orders/user/${req.params.userId}`, {
      headers: { Authorization: req.headers.authorization }
    });
    res.json(response.data);
  } catch (error: any) {
    if (error.code === 'ECONNREFUSED') {
      return res.status(503).json({
        success: false,
        message: "Order Service is not running. Please start it on port 8082"
      });
    }
    res.status(error.response?.status || 500).json(
      error.response?.data || { success: false, error: "Order Service error" }
    );
  }
});

// Pay for order
app.put("/orders/:id/pay", async (req, res) => {
  try {
    const response = await axios.put(`${ORDER_SERVICE}/api/orders/${req.params.id}/pay`, req.body, {
      headers: { Authorization: req.headers.authorization }
    });
    res.json(response.data);
  } catch (error: any) {
    if (error.code === 'ECONNREFUSED') {
      return res.status(503).json({
        success: false,
        message: "Order Service is not running. Please start it on port 8082"
      });
    }
    res.status(error.response?.status || 500).json(
      error.response?.data || { success: false, error: "Order Service error" }
    );
  }
});

// ==========================================
// PRODUCT SERVICE ROUTES (Still waiting...)
// ==========================================

app.all("/products*", async (req, res) => {
  res.status(503).json({
    success: false,
    message: "Product Service not yet implemented - waiting on Person 2"
  });
});

// ==========================================
// ERROR HANDLING
// ==========================================

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.path} not found`
  });
});

// Global error handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error("Gateway Error:", err);
  res.status(500).json({
    success: false,
    message: "API Gateway error",
    error: err.message
  });
});

// ==========================================
// START SERVER
// ==========================================

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log("");
  console.log("🚀 ========================================");
  console.log(`🚀 API Gateway running on port ${PORT}`);
  console.log(`🚀 Gateway URL: http://localhost:${PORT}`);
  console.log("🚀 ========================================");
  console.log(`✅ User Service: ${USER_SERVICE}`);
  console.log(`✅ Order Service: ${ORDER_SERVICE}`);
  console.log(`❌ Product Service: ${PRODUCT_SERVICE} (pending)`);
  console.log("🚀 ========================================");
  console.log("");
  console.log("📋 Available Routes:");
  console.log("  POST   /auth/register");
  console.log("  POST   /auth/login");
  console.log("  GET    /users/me");
  console.log("  PUT    /users/me");
  console.log("  POST   /users/logout");
  console.log("  GET    /users");
  console.log("  POST   /orders");
  console.log("  GET    /orders/:id");
  console.log("  GET    /orders/user/:userId");
  console.log("  PUT    /orders/:id/pay");
  console.log("  *      /products* (503 - Not Implemented)");
  console.log("🚀 ========================================");
  console.log("");
});