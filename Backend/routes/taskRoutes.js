const express = require("express");
const {
  createTask,
  getTasksByBoard,
  updateTask,
  deleteTask,
} = require("../controllers/taskController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// Create a new task
router.post("/", protect, createTask);

// Get all tasks for a specific board
router.get("/:boardId", protect, getTasksByBoard);

// Update a task
router.put("/:id", protect, updateTask);

// Delete a task
router.delete("/:id", protect, deleteTask);

module.exports = router;
