import postgres from "postgres";
import logger from "../utils/logger.js";

const sql = postgres({
  host: process.env.db_host,
  port: process.env.db_port,
  database: process.env.database,
  username: process.env.db_username,
  password: process.env.db_password,
  debug: console.log,
});

export default sql;
