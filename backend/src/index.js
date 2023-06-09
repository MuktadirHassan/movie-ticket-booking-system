import "dotenv/config.js";
import express from "express";
import sql from "./configs/database.js";
import { z } from "zod";
import router from "./routes/index.js";
import logger from "./utils/logger.js";
import { PORT } from "./configs/appConfig.js";
import session from "express-session";
import sessionStore from "connect-pg-simple";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    store: new (sessionStore(session))({
      // Insert connect-pg-simple options here
      conString: process.env.db_url,
      createTableIfMissing: true,
    }),
    name: "sid",
    secret: "cat",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      maxAge: 84600 * 1000, // 24 hours 84600 *
    },
  })
);

/**
 * Log request Method and URL
 */
app.use((req, res, next) => {
  logger.http(`${req.method} ${req.url}`);
  next();
});

/**
 * Routes for /api
 */
app.use("/", router);

app.use("*", (req, res) => {
  res.status(404).json({
    error: "Endpoint Not Found",
    path: req.originalUrl,
  });
});

app.use((err, req, res, next) => {
  logger.error(err);

  if (err instanceof z.ZodError) {
    return res.status(400).json({
      error: err.issues
        .map((issue) => `${issue.path} ${issue.message}`)
        .join(", "),
    });
  }
  res.status(500).json({
    error: err?.message || "Something went wrong",
  });
});

app.listen(PORT, async () => {
  const conn = await sql`SELECT 1+1 AS result`;
  logger.info(`Database connected: ${conn[0].result === 2}`);
  logger.info(`Server is running on port ${PORT}`);
});
