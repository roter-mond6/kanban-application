const users = [];

// Function to find a user by email
const findUserByEmail = (email) => {
  return users.find((user) => user.email === email);
};

// Function to add a new user
const addUser = (user) => {
  users.push(user);
};

module.exports = { users, findUserByEmail, addUser };
