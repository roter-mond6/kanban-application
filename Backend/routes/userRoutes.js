const express = require("express");
const multer = require("multer");
const {
  getUserProfile,
  updateUserProfile,
  deleteUserAccount,
} = require("../controllers/userController");
const { protect } = require("../middleware/authMiddleware");

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
});

const router = express.Router();

// Get user profile
router.get("/profile", protect, getUserProfile);

// Update user profile
router.put(
  "/profile",
  protect,
  upload.single("profilePicture"),
  updateUserProfile,
);

// Delete user account
router.delete("/profile", protect, deleteUserAccount);

module.exports = router;
