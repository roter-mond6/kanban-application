const boards = [];

const addBoard = (board) => {
  const newBoard = {
    ...board,
    status: board.status || "working" // default
  };

  boards.push(newBoard);
};


// Function to find a board by ID
const findBoardById = (id) => {
  return boards.find((board) => board.id === id);
};

// Function to find boards by user
const findBoardsByUser = (userId) => {
  return boards.filter((board) => board.owner === userId);
};



// Function to delete a board
const deleteBoard = (id) => {
  const index = boards.findIndex((board) => board.id === id);
  if (index !== -1) {
    boards.splice(index, 1);
    return true;
  }
  return false;
};






//idk what this does///
module.exports = {
  boards,
  findBoardById,
  findBoardsByUser,
  addBoard,
  deleteBoard,
};
