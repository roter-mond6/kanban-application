const express = require("express");
const { v4: uuidv4 } = require("uuid");
const { findListById, findListsByBoardId } = require("../models/listModel");
const { findBoardById, findBoardsByUser } = require("../models/boardModel");
const {
  findCardById,
  addCard,
  updateCard,
  deleteCard,
  findCardsByListId,
} = require("../models/cardModel");
const { protect: authenticateToken } = require("../middleware/authMiddleware");

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

// GET /cards/stats - return card counts for the logged-in user
router.get("/stats", authenticateToken, (req, res) => {
  try {
    const userBoards = findBoardsByUser(req.user.email);
    const boardIds = userBoards.map((b) => b.id);

    let total = 0;
    let done = 0;
    let working = 0;
    let not_started = 0;

    boardIds.forEach((boardId) => {
      const lists = findListsByBoardId(boardId);
      lists.forEach((list) => {
        const cards = findCardsByListId(list.id);
        cards.forEach((card) => {
          total++;
          const status = card.status || "not_started";
          if (status === "done" || status === "ended") done++;
          else if (
            status === "working" ||
            status === "running" ||
            status === "stuck"
          ) {
            working++;
          } else {
            not_started++;
          }
        });
      });
    });

    return res.json({
      total,
      ended: done,
      running: working,
      pending: not_started,
    });
  } catch (err) {
    console.error("Error getting card stats:", err);
    return res.status(500).json({ error: "Failed to get card stats" });
  }
});

module.exports = router;
