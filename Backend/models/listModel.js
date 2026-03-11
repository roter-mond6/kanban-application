const lists = [];

// Function to find a list by ID
const findListById = (id) => {
  return lists.find((list) => list.id === id);
};

// Function to find lists by board ID
const findListsByBoardId = (boardId) => {
  return lists.filter((list) => list.boardId === boardId);
};

// Function to add a new list
const addList = (list) => {
  lists.push(list);
};

// Function to delete a list
const deleteList = (id) => {
  const index = lists.findIndex((list) => list.id === id);
  if (index !== -1) {
    lists.splice(index, 1);
    return true;
  }
  return false;
};

module.exports = {
  lists,
  findListById,
  findListsByBoardId,
  addList,
  deleteList,
};
