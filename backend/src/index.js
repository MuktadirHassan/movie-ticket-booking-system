import express from "express";
import logger from "./config/logger.js";
import db from "./config/database.js";

const app = express();

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.listen(process.env.PORT || 3000, () => {
  logger.info(`Server started on port ${process.env.PORT || 3000}`);
});
