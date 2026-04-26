const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const taskRoutes = require("./routes/taskRoutes");
const userRoutes = require("./routes/userRoutes");

// Initialize dotenv to use environment variables
dotenv.config();

const startServer = async () => {
  await connectDB();

  // Create an Express app
  const app = express();

  // Middleware
  app.use(
    cors({
      origin: "http://localhost:3000",
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization"],
      credentials: true,
    }),
  );
  app.use(express.json());

  // Routes
  app.use("/api/auth", authRoutes);
  app.use("/api/tasks", taskRoutes);
  app.use("/api/users", userRoutes);

  // Define a simple route
  app.get("/", (req, res) => {
    res.send("Server is running!");
  });

  // Import board, list, and card routes
  const boardRoutes = require("./routes/boardRoutes");
  const listRoutes = require("./routes/listRoutes");
  const cardRoutes = require("./routes/cardRoutes");

  // Use the routes
  app.use("/boards", boardRoutes);
  app.use("/lists", listRoutes);
  app.use("/cards", cardRoutes);

  // Start the server
  const PORT = process.env.BACKEND_PORT || process.env.PORT || 5001;
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
};

startServer().catch((error) => {
  console.error("Failed to start server:", error);
  process.exit(1);
});
