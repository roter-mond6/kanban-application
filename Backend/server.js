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

// Log env vars so we can confirm Render provided them (masked values won't show in UI)
console.log("ENV FRONTEND_URL:", process.env.FRONTEND_URL || "(not set)");
console.log(
  "ENV KANBAN_APP_API_URL:",
  process.env.KANBAN_APP_API_URL || "(not set)",
);
console.log(
  "ENV REACT_APP_API_URL:",
  process.env.REACT_APP_API_URL || "(not set)",
);

const frontendBuildPath = path.join(__dirname, "../Frontend/build");

const startServer = async () => {
  await connectDB();

  // Create an Express app
  const app = express();

  // Middleware
  // Read FRONTEND_URL from env (comma-separated OK). If empty, allow all origins.
  const rawFrontends = process.env.FRONTEND_URL || "";
  const allowedOrigins = rawFrontends
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  const originOption = (origin, callback) => {
    // Allow non-browser requests (no Origin header)
    if (!origin) return callback(null, true);
    // If no allowed origins configured, allow any origin
    if (allowedOrigins.length === 0) return callback(null, true);

    try {
      const originHost = new URL(origin).host; // e.g. kanban-application-sluy-ge0kl0hyq-...vercel.app

      for (const entry of allowedOrigins) {
        const entryUrl = entry.includes("://") ? entry : `https://${entry}`;
        const entryHost = new URL(entryUrl).host; // e.g. kanban-application-sluy.vercel.app
        const entryPrefix = entryHost.split(".")[0]; // e.g. kanban-application-sluy

        // Exact host match (production)
        if (originHost === entryHost) return callback(null, true);

        // Allow Vercel preview subdomains that start with the same project prefix
        // e.g. kanban-application-sluy-<preview>.vercel.app
        if (
          originHost.endsWith(".vercel.app") &&
          originHost.startsWith(entryPrefix)
        )
          return callback(null, true);
      }
    } catch (err) {
      // If URL parsing fails, deny by default below
    }

    return callback(new Error("Not allowed by CORS"));
  };

  const corsOptions = {
    origin: originOption,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  };

  app.use(cors(corsOptions));
  app.use(express.json({ limit: "100mb" }));

  // Return a clear 400 error when JSON parsing fails (malformed JSON)
  app.use((err, req, res, next) => {
    if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
      console.error("Invalid JSON received:", err.message);
      return res.status(400).json({ error: "Invalid JSON body" });
    }
    next(err);
  });
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

    // Fallback for SPA routes: serve index.html for any request
    // Use app.use rather than a path string to avoid path-to-regexp parsing issues
    app.use((req, res) => {
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
