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
const ORDER_SERVICE = "http://localhost:8080";

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
// PRODUCT SERVICE ROUTES (Placeholder)
// ==========================================

app.all("/products*", async (req, res) => {
  res.status(503).json({
    success: false,
    message: "Product Service not yet implemented"
  });
});

// ==========================================
// ORDER SERVICE ROUTES (Placeholder)
// ==========================================

app.all("/orders*", async (req, res) => {
  res.status(503).json({
    success: false,
    message: "Order Service not yet implemented"
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
  console.log(`📡 User Service: ${USER_SERVICE}`);
  console.log(`📡 Product Service: ${PRODUCT_SERVICE} (pending)`);
  console.log(`📡 Order Service: ${ORDER_SERVICE} (pending)`);
  console.log("🚀 ========================================");
  console.log("");
});