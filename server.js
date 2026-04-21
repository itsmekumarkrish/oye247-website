const express = require("express");
const app = express();

const PORT = parseInt(process.env.PORT, 10) || 3000;

app.get("/", (req, res) => {
  res.send("Server is running 🚀");
});

const server = app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});

server.on("error", (err) => {
  console.error(`Failed to start server: ${err.message}`);
  process.exit(1);
});

process.on("uncaughtException", (err) => {
  console.error(`Uncaught exception: ${err.message}`);
  process.exit(1);
});

process.on("unhandledRejection", (reason) => {
  console.error(`Unhandled rejection: ${reason}`);
  process.exit(1);
});
