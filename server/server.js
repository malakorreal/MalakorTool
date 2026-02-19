const express = require("express");

const app = express();
const PORT = process.env.PORT || 3000;

app.get("/health", (req, res) => {
  res.json({ ok: true });
});

app.get("/", (req, res) => {
  res.send("MalakorTool API running");
});

app.listen(PORT, () => {
  console.log("MalakorTool API running on port", PORT);
});

