import express from "express";
import morgan from "morgan";
import db from "./configs/database.js";
import loggerLevels from "./constants/loggerLevels.js";

const app = express();

app.use(morgan("dev"));

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.listen(process.env.PORT || 3000, () => {
  console.log(
    `[${
      loggerLevels.info
    }] [${new Date().toLocaleString()}] Server is running at port ${
      process.env.PORT || 3000
    }`
  );
});
