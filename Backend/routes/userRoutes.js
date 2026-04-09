const express = require("express");
const {
  getUserProfile,
  updateUserProfile,
  deleteUserAccount,
} = require("../controllers/userController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// Get user profile
router.get("/profile", protect, getUserProfile);

// Update user profile
router.put("/profile", protect, updateUserProfile);

// Delete user account
router.delete("/profile", protect, deleteUserAccount);

module.exports = router;
