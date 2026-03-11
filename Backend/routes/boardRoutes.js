const express = require("express");
const { v4: uuidv4 } = require("uuid");
const {
  findBoardById,
  findBoardsByUser,
  addBoard,
  deleteBoard,
} = require("../models/boardModel");
const authenticateToken = require("../authMiddleware");

const router = express.Router();

// POST /boards - Create a new board
router.post("/", authenticateToken, (req, res) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ message: "Board name is required" });
  }

  const newBoard = {
    id: uuidv4(), // Generate a unique ID for the board
    name,
    owner: req.user.email, // The logged-in user's email
  };

  addBoard(newBoard);
  res
    .status(201)
    .json({ message: "Board created successfully", board: newBoard });
});

// GET /boards - Get all boards for the logged-in user
router.get("/", authenticateToken, (req, res) => {
  const userBoards = findBoardsByUser(req.user.email);
  res.json(userBoards);
});

// DELETE /boards/:id - Delete a board
router.delete("/:id", authenticateToken, (req, res) => {
  const { id } = req.params;

  const board = findBoardById(id);
  if (!board) {
    return res.status(404).json({ message: "Board not found" });
  }

  if (board.owner !== req.user.email) {
    return res
      .status(403)
      .json({ message: "You are not authorized to delete this board" });
  }

  deleteBoard(id);
  res.json({ message: "Board deleted successfully" });
});

module.exports = router;
