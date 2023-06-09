import express from "express";
import morgan from "morgan";
import db from "./configs/database.js";

import logger from "./utils/logger.js";
import { PORT } from "./configs/appConfig.js";

const app = express();

app.use(morgan("dev"));

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.listen(PORT, () => {
  logger.info(`Server is running on port ${PORT}`);
});
