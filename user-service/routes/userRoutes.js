const express = require("express");
const {
  registerUser,
  loginUser,
  getAllUsers,
  getCurrentUser,
  updateUser,
  logout,
  changePassword,
  deleteAccount
} = require("../controllers/userController");

const authenticate = require("../middleware/auth");
const verifyRecaptcha = require("../middleware/verifyRecaptcha");


const router = express.Router();

// ==========================================
// PUBLIC ROUTES (No authentication required)
// ==========================================

router.post("/register", verifyRecaptcha, registerUser);
router.post("/login", verifyRecaptcha, loginUser);


// ==========================================
// PROTECTED ROUTES (Authentication required)
// ==========================================

// User profile
router.get("/me", authenticate, getCurrentUser);
router.put("/me", authenticate, updateUser);
router.put("/me/password", authenticate, changePassword);
router.delete("/me", authenticate, deleteAccount);
router.post("/logout", authenticate, logout);

// Admin - get all users
router.get("/", authenticate, getAllUsers);

module.exports = router;