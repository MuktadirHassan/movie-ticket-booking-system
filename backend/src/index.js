import "dotenv/config.js";
import express from "express";
import morgan from "morgan";
import sql from "./configs/database.js";

import logger from "./utils/logger.js";
import { PORT } from "./configs/appConfig.js";

const app = express();

app.use(morgan(""));

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.listen(PORT, async () => {
  const conn = await sql`SELECT 1+1 AS result`;
  logger.info(`Database connected: ${conn[0].result === 2}`);
  logger.info(`Server is running on port ${PORT}`);
});
