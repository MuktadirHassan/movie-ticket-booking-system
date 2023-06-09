/**
 * Database Initialization
 */
import "dotenv/config.js";
import logger from "../utils/logger.js";
import sql from "./database.js";

(async () => {
  logger.info("Database seeding and initialization started...");
  const conn = await sql`SELECT 1+1 AS result`;
  logger.info(`Database connected: ${conn[0].result === 2}`);

  // Create Tables

  await sql`
    CREATE TABLE IF NOT EXISTS users (
        user_id SERIAL,
        username varchar(255) NOT NULL,
        email varchar(255) NOT NULL,
        password varchar(255) NOT NULL,
        phone_number varchar(255) NOT NULL,
        PRIMARY KEY (user_id)
    );
  `;
  logger.info("users table created");

  await sql`
    CREATE TABLE IF NOT EXISTS movies (
        movie_id SERIAL,
        movie_name varchar(255) NOT NULL,
        description text NOT NULL,
        release_date date NOT NULL,
        duration int NOT NULL,
        PRIMARY KEY (movie_id)
    );
 `;
  logger.info("movies table created");

  await sql`
    CREATE TABLE IF NOT EXISTS halls (
        hall_id SERIAL,
        hall_name varchar(255) NOT NULL,
        PRIMARY KEY (hall_id)
    );
  `;
  logger.info("halls table created");

  await sql`
    CREATE TABLE IF NOT EXISTS shows (
        show_id SERIAL,
        hall_id int NOT NULL,
        movie_id int NOT NULL,
        show_date date NOT NULL,
        show_time time NOT NULL,
        PRIMARY KEY (show_id),
        FOREIGN KEY (hall_id) REFERENCES halls(hall_id),
        FOREIGN KEY (movie_id) REFERENCES movies(movie_id)
    );
  `;
  logger.info("shows table created");

  await sql`
    CREATE TABLE IF NOT EXISTS seats (
        seat_id SERIAL,
        hall_id int NOT NULL,
        seat_number int NOT NULL,
        PRIMARY KEY (seat_id),
        FOREIGN KEY (hall_id) REFERENCES halls(hall_id)
    );
  `;
  logger.info("seats table created");

  await sql`
    CREATE TABLE IF NOT EXISTS bookings (
        booking_id SERIAL,
        user_id int NOT NULL,
        show_id int NOT NULL,
        booking_date date NOT NULL,
        amount_paid int NOT NULL,
        PRIMARY KEY (booking_id),
        FOREIGN KEY (user_id) REFERENCES users(user_id),
        FOREIGN KEY (show_id) REFERENCES shows(show_id)
    );
  `;
  logger.info("bookings table created");

  await sql`
    CREATE TABLE IF NOT EXISTS booked_seats (
        booked_seat_id SERIAL,
        booking_id int NOT NULL,
        seat_id int NOT NULL,
        PRIMARY KEY (booked_seat_id),
        FOREIGN KEY (booking_id) REFERENCES bookings(booking_id),
        FOREIGN KEY (seat_id) REFERENCES seats(seat_id)
    );
  `;
  logger.info("booked_seats table created");

  logger.info("Initialization completed");
  await sql.end();
  process.exit(0);
})().catch((err) => {
  logger.error(err);
  sql
    .end()
    .then(() => process.exit(1))
    .catch((err) => {
      process.exit(1);
    });
});
