const express = require("express");
const {
  registerUser,
  loginUser,
  getAllUsers,
  getCurrentUser,
  updateUser,
  logout
} = require("../controllers/userController");

const authenticate = require("../middleware/auth");

const router = express.Router();

// ==========================================
// PUBLIC ROUTES (No authentication required)
// ==========================================

router.post("/register", registerUser);
router.post("/login", loginUser);

// ==========================================
// PROTECTED ROUTES (Authentication required)
// ==========================================

// User profile
router.get("/me", authenticate, getCurrentUser);
router.put("/me", authenticate, updateUser);
router.post("/logout", authenticate, logout);

// Admin - get all users
router.get("/", authenticate, getAllUsers);

module.exports = router;