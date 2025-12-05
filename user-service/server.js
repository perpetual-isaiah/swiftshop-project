const express = require("express");
const connectDB = require("./swiftshopdb");
const userRoutes = require("./routes/userRoutes");

const app = express();

// Middleware
app.use(express.json());

// Routes
app.use("/api/users", userRoutes);

// Default route
app.get("/", (req, res) => {
  res.json({ message: "User Service is running!" });
});

// Connect to MongoDB first, then start server
connectDB().then(() => {
  console.log("Database connected. Starting server...");

  const PORT = 3001;
  app.listen(PORT, () => {
    console.log(`User Service running on port ${PORT}`);
  });
});
