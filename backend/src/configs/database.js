import postgres from "postgres";

const sql = postgres({
  host: process.env.db_host,
  port: process.env.db_port,
  database: process.env.database,
  username: process.env.db_username,
  password: process.env.db_password,
});

export default sql;
