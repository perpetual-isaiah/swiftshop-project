require("dotenv").config();
const express = require("express");
const connectDB = require("./swiftshopdb");
const userRoutes = require("./routes/userRoutes");

const app = express();

// Middleware
app.use(express.json());

// Routes
app.use("/api/users", userRoutes);

// Health check
app.get("/health", (req, res) => {
  res.json({ success: true, service: "User Service", status: "running" });
});

// Default route
app.get("/", (req, res) => {
  res.json({ message: "User Service is running!" });
});

// Use PORT from .env
const PORT = process.env.PORT || 3001;

// Connect to MongoDB first, then start server
connectDB().then(() => {
  console.log("Database connected. Starting server...");
  
  app.listen(PORT, () => {
    console.log(`User Service running on port ${PORT}`);
  });
});