const cards = [];

// Function to find a card by ID
const findCardById = (id) => {
  return cards.find((card) => card.id === id);
};

// Function to find cards by list ID
const findCardsByListId = (listId) => {
  return cards.filter((card) => card.listId === listId);
};

// Function to add a new card
const addCard = (card) => {
  cards.push(card);
};

// Function to update a card
const updateCard = (id, updatedFields) => {
  const card = findCardById(id);
  if (card) {
    Object.assign(card, updatedFields); // Update the card with new fields
    return card;
  }
  return null;
};

// Function to delete a card
const deleteCard = (id) => {
  const index = cards.findIndex((card) => card.id === id);
  if (index !== -1) {
    cards.splice(index, 1);
    return true;
  }
  return false;
};

module.exports = {
  cards,
  findCardById,
  findCardsByListId,
  addCard,
  updateCard,
  deleteCard,
};
