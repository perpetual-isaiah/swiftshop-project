const express = require("express");
const app = express();

app.get("/", (req, res) => {
  res.json({ message: "User Service is running!" });
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`User Service running on port ${PORT}`);
});
