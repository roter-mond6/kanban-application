const express = require("express");
const { v4: uuidv4 } = require("uuid");
const { findBoardById } = require("../models/boardModel");
const { findListById, addList, deleteList } = require("../models/listModel");
const authenticateToken = require("../authMiddleware");

const router = express.Router();

// POST /boards/:boardId/lists - Create a new list
router.post("/:boardId/lists", authenticateToken, (req, res) => {
  const { boardId } = req.params;
  const { name } = req.body;

  const board = findBoardById(boardId);
  if (!board) {
    return res.status(404).json({ message: "Board not found" });
  }

  if (board.owner !== req.user.email) {
    return res
      .status(403)
      .json({ message: "You are not authorized to add lists to this board" });
  }

  const newList = {
    id: uuidv4(),
    name,
    boardId,
  };

  addList(newList);
  res.status(201).json({ message: "List created successfully", list: newList });
});

// DELETE /lists/:id - Delete a list
router.delete("/:id", authenticateToken, (req, res) => {
  const { id } = req.params;

  const list = findListById(id);
  if (!list) {
    return res.status(404).json({ message: "List not found" });
  }

  const board = findBoardById(list.boardId);
  if (!board || board.owner !== req.user.email) {
    return res
      .status(403)
      .json({ message: "You are not authorized to delete this list" });
  }

  deleteList(id);
  res.json({ message: "List deleted successfully" });
});

module.exports = router;
