const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const fs = require("fs");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const taskRoutes = require("./routes/taskRoutes");
const userRoutes = require("./routes/userRoutes");

// Initialize dotenv to use environment variables
dotenv.config();

const frontendBuildPath = path.join(__dirname, "../Frontend/build");

const startServer = async () => {
  await connectDB();

  // Create an Express app
  const app = express();

  // Middleware
  const corsOptions = {
    origin: process.env.FRONTEND_URL || true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  };

  app.use(cors(corsOptions));
  app.options("*", cors(corsOptions));
  app.use(express.json({ limit: "100mb" }));
  app.use(express.urlencoded({ limit: "100mb", extended: true }));

  // Routes
  app.use("/api/auth", authRoutes);
  app.use("/api/tasks", taskRoutes);
  app.use("/api/users", userRoutes);

  // Import board, list, and card routes
  const boardRoutes = require("./routes/boardRoutes");
  const listRoutes = require("./routes/listRoutes");
  const cardRoutes = require("./routes/cardRoutes");

  // Use the routes
  app.use("/boards", boardRoutes);
  app.use("/lists", listRoutes);
  app.use("/cards", cardRoutes);

  if (fs.existsSync(frontendBuildPath)) {
    app.use(express.static(frontendBuildPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(frontendBuildPath, "index.html"));
    });
  } else {
    // Define a simple route when frontend bundle is not available
    app.get("/", (req, res) => {
      res.send("Server is running!");
    });
  }

  app.use((err, req, res, next) => {
    if (err.type === "entity.too.large" || err.code === "LIMIT_FILE_SIZE") {
      return res.status(413).json({
        error: "Image upload too large. Please choose a smaller photo.",
      });
    }
    console.error("Server error:", err);
    res.status(500).json({ error: "Server error" });
  });

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
