const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const taskRoutes = require("./routes/taskRoutes");
const userRoutes = require("./routes/userRoutes");

// Initialize dotenv to use environment variables
dotenv.config();

// Create an Express app
const app = express();

app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/users", userRoutes); // Add user routes

// Middleware
app.use(cors());
app.use(express.json());

// Define a simple route
app.get("/", (req, res) => {
  res.send("Server is running!");
});

const bcrypt = require("bcrypt");

const jwt = require("jsonwebtoken");
const { users, findUserByEmail, addUser } = require("./users");

// POST /register
app.post("/register", async (req, res) => {
  const { email, password } = req.body;

  // Check if the user already exists
  if (findUserByEmail(email)) {
    return res.status(400).json({ message: "User already exists" });
  }

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Add the new user to the database
  const newUser = { email, password: hashedPassword };
  addUser(newUser);

  res.status(201).json({ message: "User registered successfully" });
});

// POST /login
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  // Find the user by email
  const user = findUserByEmail(email);
  if (!user) {
    return res.status(400).json({ message: "Invalid email or password" });
  }

  // Compare the provided password with the hashed password
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return res.status(400).json({ message: "Invalid email or password" });
  }

  // Generate a JWT
  const token = jwt.sign({ email: user.email }, process.env.JWT_SECRET, {
    expiresIn: "1h", // Token expires in 1 hour
  });

  res.json({ token });
});

// Import the auth middleware
const authenticateToken = require("./authMiddleware");

// Protected route
app.get("/me", authenticateToken, (req, res) => {
  res.json({ message: "This is a protected route", user: req.user });
});

const boardRoutes = require("./routes/boardRoutes");
const listRoutes = require("./routes/listRoutes");
const cardRoutes = require("./routes/cardRoutes");

// Use the card routes
app.use("/lists", cardRoutes);

// Use the list routes
app.use("/boards", listRoutes);

// Use the board routes
app.use("/boards", boardRoutes);

// Start the server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
