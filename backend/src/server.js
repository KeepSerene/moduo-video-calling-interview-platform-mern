import express from "express";
import ENV from "./lib/env.js";

const app = express();

app.get("/", (req, res) => {
  res.status(200).json({ msg: "Hello from the server!" });
});

app.listen(ENV.PORT, () => console.log(`Server running on port ${ENV.PORT}`));
