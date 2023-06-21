import express from "express";
const router = express.Router();
import bcrypt from "bcrypt";
import sql from "../configs/database.js";
import catchAsync from "../utils/catchAsync.js";
import { z } from "zod";
import auth from "../middlewares/auth.js";
/**
 * Routes for /api
 */

// - [x] Create User
// - [x] User Login
// - [x] CRUD Movies
// - [x] CRUD Halls
// - [x] CRUD Shows
// - [x] Book Tickets for a show
// - [x] View Booked Tickets
// - [x] Create Seat Layout for a hall
router.post("/seats/create/:hallId", async (req, res) => {
  const { hallId } = req.params;

  // create 50 seats
  const newSeats = await Promise.all(
    Array.from({ length: 50 }).map(async (_, index) => {
      const newSeat = await sql`
      INSERT INTO seats (
        hall_id, seat_number
      ) VALUES (
        ${hallId}, ${index + 1}
      ) RETURNING *`;

      return newSeat[0];
    })
  );

  return res.status(201).json({
    message: "Seats created successfully",
    seats: newSeats,
  });
});

router.get("/", auth, (req, res) => {
  res.json({
    message: "API is working",
  });
});

router.get(
  "/me",
  catchAsync(async (req, res) => {
    const { user } = req.session;
    if (!user) {
      return res.status(401).json({
        error: "User not logged in",
      });
    }

    return res.status(200).json({
      message: "User fetched successfully",
      user,
    });
  })
);

router.post(
  "/logout",
  catchAsync(async (req, res) => {
    req.session.destroy();
    return res.status(200).json({
      message: "User logged out successfully",
    });
  })
);

/**
 * Regiser User
 */

router.post(
  "/register",
  catchAsync(async (req, res) => {
    const schema = z
      .object({
        username: z.string(),
        email: z.string().email(),
        password: z.string(),
        phone_number: z.string(),
      })
      .required();

    const userData = schema.parse(req.body);
    const { username, email, password, phone_number } = userData;

    const findUser = await sql`
    SELECT * FROM users WHERE email = ${email}`;

    if (findUser.length > 0) {
      return res.status(409).json({
        error: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await sql`
    INSERT INTO users (
      username, email, password, phone_number
    ) VALUES (
      ${username}, ${email}, ${hashedPassword}, ${phone_number}
    ) RETURNING *`;

    const user = {
      user_id: newUser[0].user_id,
      username: newUser[0].username,
      email: newUser[0].email,
    };

    req.session.user = user;

    return res.status(201).json({
      message: "User created successfully",
      user,
    });
  })
);

/**
 * Login User
 */
router.post(
  "/login",
  catchAsync(async (req, res) => {
    const schema = z
      .object({
        email: z.string().email(),
        password: z.string(),
      })
      .required();

    const userData = schema.parse(req.body);
    const { email, password } = userData;

    const findUser = await sql`
  SELECT * FROM users WHERE email = ${email}`;

    if (findUser.length === 0) {
      return res.status(404).json({
        error: "User not found",
      });
    }

    const isPasswordValid = await bcrypt.compare(
      password,
      findUser[0].password
    );

    if (!isPasswordValid) {
      return res.status(401).json({
        error: "Invalid password",
      });
    }

    const user = {
      user_id: findUser[0].user_id,
      username: findUser[0].username,
      email: findUser[0].email,
    };

    req.session.user = user;

    return res.status(200).json({
      message: "User logged in successfully",
      user,
    });
  })
);

router.post(
  "/movies/create",
  catchAsync(async (req, res) => {
    const schema = z
      .object({
        movie_name: z.string(),
        description: z.string(),
        release_date: z.string(),
        duration: z.number(),
      })
      .required();

    const movieData = schema.parse(req.body);
    const { movie_name, description, release_date, duration } = movieData;

    const newMovie = await sql`
    INSERT INTO movies (
      movie_name, description, release_date, duration
    ) VALUES (
      ${movie_name}, ${description}, ${release_date}, ${duration}
    ) RETURNING *`;

    return res.status(201).json({
      message: "Movie created successfully",
      movie: newMovie[0],
    });
  })
);

router.get(
  "/movies",
  catchAsync(async (req, res) => {
    const movies = await sql`
    SELECT * FROM movies`;

    return res.status(200).json({
      message: "Movies fetched successfully",
      movies,
    });
  })
);

router.get(
  "/movies/:movieId",
  catchAsync(async (req, res) => {
    const { movieId } = req.params;

    const movie = await sql`
  SELECT * FROM movies WHERE movie_id = ${movieId}`;

    const shows = await sql`
      SELECT * FROM shows
      left join halls on halls.hall_id = shows.hall_id
      WHERE movie_id = ${movieId}
  `;

    if (movie.length === 0) {
      return res.status(404).json({
        error: "Movie not found",
      });
    }

    return res.status(200).json({
      message: "Movie fetched successfully",
      movie: movie[0],
      shows,
    });
  })
);

router.patch(
  "/movies/:movieId",
  catchAsync(async (req, res) => {
    const schema = z
      .object({
        movie_name: z.string(),
        description: z.string(),
        release_date: z.string(),
        duration: z.number(),
      })
      .partial()
      .required();

    const movieData = schema.parse(req.body);
    const { movie_name, description, release_date, duration } = movieData;
    const { movieId } = req.params;

    const updatedMovie = await sql`
    UPDATE movies SET
      movie_name = ${movie_name},
      description = ${description},
      release_date = ${release_date},
      duration = ${duration}
    WHERE movie_id = ${movieId}
    RETURNING *`;

    return res.status(200).json({
      message: "Movie updated successfully",
      movie: updatedMovie[0],
    });
  })
);

router.delete(
  "/movies/:movieId",
  catchAsync(async (req, res) => {
    const { movieId } = req.params;

    const deletedMovie = await sql`
    DELETE FROM movies
    WHERE movie_id = ${movieId}
    RETURNING *`;

    return res.status(200).json({
      message: "Movie deleted successfully",
      movie: deletedMovie[0],
    });
  })
);

router.post(
  "/halls/create",
  catchAsync(async (req, res) => {
    const schema = z
      .object({
        hall_name: z.string(),
      })
      .required();

    const hallData = schema.parse(req.body);

    const { hall_name } = hallData;

    const newHall = await sql`
    INSERT INTO halls (
      hall_name
    ) VALUES (
      ${hall_name}
    ) RETURNING *`;

    return res.status(201).json({
      message: "Hall created successfully",
      hall: newHall[0],
    });
  })
);

router.get(
  "/halls",
  catchAsync(async (req, res) => {
    const halls = await sql`
    SELECT * FROM halls`;

    return res.status(200).json({
      message: "Halls fetched successfully",
      halls,
    });
  })
);

router.delete(
  "/halls/:hallId",
  catchAsync(async (req, res) => {
    const { hallId } = req.params;

    const deletedHall = await sql`
    DELETE FROM halls
    WHERE hall_id = ${hallId}
    RETURNING *`;

    return res.status(200).json({
      message: "Hall deleted successfully",
      hall: deletedHall[0],
    });
  })
);

router.post(
  "/shows/create",
  catchAsync(async (req, res) => {
    const schema = z
      .object({
        movie_id: z.number(),
        hall_id: z.number(),
        show_time: z.string(),
        show_date: z.string(),
      })
      .required();

    const showData = schema.parse(req.body);

    const { movie_id, hall_id, show_time, show_date } = showData;

    const newShow = await sql`
    INSERT INTO shows (
      movie_id, hall_id, show_time, show_date
    ) VALUES (
      ${movie_id}, ${hall_id}, ${show_time}, ${show_date} 
    ) RETURNING *`;

    return res.status(201).json({
      message: "Show created successfully",
      show: newShow[0],
    });
  })
);

router.get(
  "/shows",
  catchAsync(async (req, res) => {
    const shows = await sql`
    SELECT * FROM shows`;

    return res.status(200).json({
      message: "Shows fetched successfully",
      shows,
    });
  })
);

router.post(
  "/bookings/create",
  auth,
  catchAsync(async (req, res) => {
    const schema = z
      .object({
        show_id: z.number(),
        booking_date: z.string(),
        amount_paid: z.number(),
        seat_ids: z.array(z.number()),
      })
      .required();

    const user_id = req.user.user_id;
    const bookingData = schema.parse(req.body);

    const { show_id, booking_date, amount_paid } = bookingData;

    const [newBooking, booked_seats] = await sql.begin(async (sql) => {
      const [newBooking] = await sql`
      INSERT INTO bookings (
        show_id, user_id, booking_date, amount_paid
      ) VALUES (
        ${show_id}, ${user_id}, ${booking_date}, ${amount_paid}
      ) RETURNING *`;

      const [booked_seats] = await Promise.all(
        bookingData.seat_ids.map(async (seat_id) => {
          const newBookedSeat = await sql`
        INSERT INTO booked_seats (
          booking_id, seat_id
        ) VALUES (
          ${newBooking[0].booking_id}, ${seat_id}
        ) RETURNING *`;

          return newBookedSeat[0];
        })
      );

      return [newBooking, booked_seats];
    });

    return res.status(201).json({
      message: "Booking created successfully",
      booking: newBooking[0],
      booked_seats,
    });
  })
);

router.get(
  "/bookings",
  catchAsync(async (req, res) => {
    const bookings = await sql`
    SELECT * FROM bookings`;

    return res.status(200).json({
      message: "Bookings fetched successfully",
      bookings,
    });
  })
);

router.get(
  "/my-bookings",
  auth,
  catchAsync(async (req, res) => {
    const { user_id } = req.user;

    const bookings = await sql`
    SELECT * FROM bookings
    join shows on bookings.show_id = shows.show_id
    join movies on shows.movie_id = movies.movie_id
    join halls on shows.hall_id = halls.hall_id
    join booked_seats on bookings.booking_id = booked_seats.booking_id
    join seats on booked_seats.seat_id = seats.seat_id
    WHERE user_id = ${user_id}
    `;

    return res.status(200).json({
      message: "Bookings fetched successfully",
      bookings,
    });
  })
);

/**
 * Available seats for a show
 */
router.get(
  "/shows/seats",
  catchAsync(async (req, res) => {
    const { showId, hallId } = req.query;

    const bookedSeats = await sql`
    SELECT * FROM booked_seats
    WHERE booking_id IN (
      SELECT booking_id FROM bookings
      WHERE show_id = ${showId}
    )`;

    const bookedSeatIds = bookedSeats.map((seat) => seat.seat_id);

    const seats = await sql`
    SELECT seat_number, seat_id FROM seats
    WHERE hall_id = ${hallId}
    ORDER BY seat_number ASC
    `;

    const seatsWithAvailability = seats.map((seat) => {
      if (bookedSeatIds.includes(seat.seat_id)) {
        return {
          ...seat,
          available: false,
        };
      }

      return {
        ...seat,
        available: true,
      };
    });

    return res.status(200).json({
      message: "Seats fetched successfully",
      seats: seatsWithAvailability,
    });
  })
);

export default router;
