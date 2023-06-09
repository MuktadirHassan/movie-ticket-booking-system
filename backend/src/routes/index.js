import express from "express";
const router = express.Router();
import bcrypt from "bcrypt";
import sql from "../configs/database.js";
import catchAsync from "../utils/catchAsync.js";
import { z } from "zod";
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

    delete newUser[0].password;

    req.session.user = user;

    return res.status(201).json({
      message: "User created successfully",
      user: newUser[0],
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

    const user = findUser[0];

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        error: "Invalid password",
      });
    }

    delete user.password;

    req.session.user = user;

    return res.status(200).json({
      message: "User logged in successfully",
      user,
    });
  })
);

export default router;
