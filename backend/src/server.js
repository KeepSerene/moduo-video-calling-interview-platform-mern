import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import ENV from "./lib/env.js";
import { connectToDB } from "./lib/db.js";

const app = express();

// Get the actual directory of THIS file (server.js)
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Middleware to parse JSON (needed for POST requests)
app.use(express.json());

// API routes should come BEFORE static file serving
app.get("/api/test", (req, res) => {
  res.status(200).json({ msg: "Hello from the test server!" });
});

// In production, serve the React app
if (ENV.NODE_ENV === "production") {
  // serve static files from the React build
  app.use(express.static(path.join(__dirname, "../../frontend/dist")));

  // catch-all route: for any route not matched above, serve index.html
  // allows React Router to handle routing on the client side
  app.get("/{*any}", (req, res) => {
    res.sendFile(path.join(__dirname, "../../frontend/dist/index.html"));
  });
}

async function startServer() {
  await connectToDB();
  app.listen(ENV.PORT, () => {
    console.log(`Server running on port ${ENV.PORT}`);
    console.log(`Environment: ${ENV.NODE_ENV}`);
  });
}

(async () => {
  try {
    await startServer();
  } catch (error) {
    console.error("Error starting the server:", error);
  }
})();
