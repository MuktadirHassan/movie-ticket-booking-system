import "dotenv/config.js";
import express from "express";
import sql from "./configs/database.js";
import { z } from "zod";
import router from "./routes/index.js";
import logger from "./utils/logger.js";
import { PORT } from "./configs/appConfig.js";
import session from "express-session";
import sessionStore from "connect-pg-simple";
import cors from "cors";

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

app.use(
  cors({
    credentials: true,
    origin: "http://localhost:5173",
  })
);

/**
 * Convert hrtime to milliseconds
 */
const getDurationInMilliseconds = (start) => {
  const NS_PER_SEC = 1e9; //  convert to nanoseconds
  const NS_TO_MS = 1e6; // convert to milliseconds
  const diff = process.hrtime(start);

  return (diff[0] * NS_PER_SEC + diff[1]) / NS_TO_MS;
};

/**
 * Log request Method and URL, response statua and response time
 */
app.use((req, res, next) => {
  const start = process.hrtime();

  res.on("finish", () => {
    const durationInMilliseconds = getDurationInMilliseconds(start);

    logger.http(
      `${res.statusCode} ${req.method} ${req.originalUrl} - ${durationInMilliseconds}ms`
    );
  });

  next();
});

/**
 * Routes for /api
 */
app.use("/api", router);

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
