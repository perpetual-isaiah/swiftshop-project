import express from "express";
import axios from "axios";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("API Gateway is running!");
});

// USER SERVICE
app.get("/users", async (req, res) => {
  try {
    const response = await axios.get("http://localhost:3000/");
    res.send(response.data);
  } catch (error: any) {
    res.status(500).json({ error: "User Service not reachable" });
  }
});

// PRODUCT SERVICE
app.get("/products", async (req, res) => {
  try {
    const response = await axios.get("http://127.0.0.1:8000/");
    res.send(response.data);
  } catch (error: any) {
    res.status(500).json({ error: "Product Service not reachable" });
  }
});

// ORDER SERVICE
app.get("/orders", async (req, res) => {
  try {
    const response = await axios.get("http://localhost:8082/");
    res.send(response.data);
  } catch (error: any) {
    res.status(500).json({ error: "Order Service not reachable" });
  }
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`API Gateway running on port ${PORT}`);
});
