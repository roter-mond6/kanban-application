const task = [];

//Fnction to find a task by ID
const findTaskById = (id) => {
  return task.find((task) => task.id === id);
};

//Function to find tasks by list ID
const findTasksByListId = (listId) => {
  return task.filter((task) => task.listId === listId);
};

//Function to add a new task
const addTask = (task) => {
  task.push(task);
};

//Function to delete a task
const deleteTask = (id) => {
  const index = task.findIndex((task) => task.id === id);
  if (index !== -1) {
    task.splice(index, 1);
    return true;
  }
  return false;
};

module.exports = {
  task,
  findTaskById,
  findTasksByListId,
  addTask,
  deleteTask,
};
