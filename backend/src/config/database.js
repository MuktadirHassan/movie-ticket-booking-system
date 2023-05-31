import mysql from "mysql2/promise";
import logger from "./logger.js";

// create the connection to database
const connection = mysql.createConnection({
  host: "aws.connect.psdb.cloud",
  user: "tf3gzstnhuaknsqrvzcq",
  password: "pscale_pw_YD8woLZ76QrNJ4vEIioJ714hnN40qpCXx4xYOZn5luc",
  database: "test",
});

const db = connection
  .then((conn) => {
    logger.info("Database connected");
    return conn;
  })
  .catch((err) => {
    logger.error(err);
    process.exit(1);
  });

export default db;
