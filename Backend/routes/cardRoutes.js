const express = require("express");
const { v4: uuidv4 } = require("uuid");
const { findListById } = require("../models/listModel");
const { findBoardById } = require("../models/boardModel");
const {
  findCardById,
  addCard,
  updateCard,
  deleteCard,
} = require("../models/cardModel");
const authenticateToken = require("../authMiddleware");

const router = express.Router();

// POST /lists/:listId/cards - Create a new card
router.post("/:listId/cards", authenticateToken, (req, res) => {
  const { listId } = req.params;
  const { title, description } = req.body;

  const list = findListById(listId);
  if (!list) {
    return res.status(404).json({ message: "List not found" });
  }

  const board = findBoardById(list.boardId);
  if (!board || board.owner !== req.user.email) {
    return res
      .status(403)
      .json({ message: "You are not authorized to add cards to this list" });
  }

  const newCard = {
    id: uuidv4(),
    title,
    description,
    listId,
  };

  addCard(newCard);
  res.status(201).json({ message: "Card created successfully", card: newCard });
});

// PUT /cards/:id - Update a card
router.put("/:id", authenticateToken, (req, res) => {
  const { id } = req.params;
  const { title, description } = req.body;

  const card = findCardById(id);
  if (!card) {
    return res.status(404).json({ message: "Card not found" });
  }

  const list = findListById(card.listId);
  const board = findBoardById(list.boardId);
  if (!board || board.owner !== req.user.email) {
    return res
      .status(403)
      .json({ message: "You are not authorized to update this card" });
  }

  const updatedCard = updateCard(id, { title, description });
  res.json({ message: "Card updated successfully", card: updatedCard });
});

// DELETE /cards/:id - Delete a card
router.delete("/:id", authenticateToken, (req, res) => {
  const { id } = req.params;

  const card = findCardById(id);
  if (!card) {
    return res.status(404).json({ message: "Card not found" });
  }

  const list = findListById(card.listId);
  const board = findBoardById(list.boardId);
  if (!board || board.owner !== req.user.email) {
    return res
      .status(403)
      .json({ message: "You are not authorized to delete this card" });
  }

  deleteCard(id);
  res.json({ message: "Card deleted successfully" });
});

module.exports = router;
