import "dotenv/config.js";
import express from "express";
import sql from "./configs/database.js";

import logger from "./utils/logger.js";
import { PORT } from "./configs/appConfig.js";

const app = express();

/**
 * Log request Method and URL
 */
app.use((req, res, next) => {
  logger.http(`${req.method} ${req.url}`);
  next();
});

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.listen(PORT, async () => {
  const conn = await sql`SELECT 1+1 AS result`;
  logger.info(`Database connected: ${conn[0].result === 2}`);
  logger.info(`Server is running on port ${PORT}`);
});
