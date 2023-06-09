/**
 * Seed database
 */
import "dotenv/config.js";
import sql from "./database.js";
import logger from "../utils/logger.js";

(async () => {
  const conn = await sql`
     SELECT 1+1 AS result
    `;
  logger.info(`Database connected: ${conn[0].result === 2}`);
  logger.info("Database seeding started...");
  await sql`
    INSERT INTO users (username, email, password, phone_number)
    VALUES
        ('admin', 'admin@admin.com', 'admin', '1234567890')
    `;
  logger.info("users table seeded");
  await sql`
    INSERT INTO movies (movie_name, description, release_date, duration)
    VALUES
        ('Fast X, The Final Ride', 'The final ride of the Fast and Furious franchise', '2021-06-25', 120),
        ('The Avengers', 'The first movie of the Avengers franchise', '2012-05-04', 143),
        ('The Avengers: Endgame', 'The final movie of the Avengers franchise', '2019-04-26', 181),
        ('The Avengers: Infinity War', 'The second movie of the Avengers franchise', '2018-04-27', 149),
        ('The Avengers: Age of Ultron', 'The third movie of the Avengers franchise', '2015-05-01', 141)
    `;
  logger.info("movies table seeded");

  await sql`
    INSERT INTO halls (hall_name)
    VALUES
        ('Hall 1'),
        ('Hall 2'),
        ('Hall 3')
    `;
  logger.info("halls table seeded");

  await sql`
    INSERT INTO shows (hall_id, movie_id, show_date, show_time)
    VALUES
        (1, 1, '2021-06-25', '10:00'),
        (1, 1, '2021-06-25', '13:00'),
        (1, 1, '2021-06-25', '16:00'),
        (1, 1, '2021-06-25', '19:00')
    `;
  logger.info("shows table seeded");

  await sql`
     INSERT into seats (hall_id, seat_number)
        VALUES  
            (1, 1),
            (1, 2),
            (1, 3),
            (1, 4),
            (1, 5)
    `;
  logger.info("seats table seeded");

  logger.info("Database seeding finished");
  process.exit(0);
})().catch((err) => {
  logger.error(err.stack);
  process.exit(1);
});
