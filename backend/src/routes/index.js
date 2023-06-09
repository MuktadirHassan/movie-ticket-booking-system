const router = require("express").Router();

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
router.post("/register", (req, res) => {
  res.send("Register User");
});

/**
 * Login User
 */
router.post("/login", (req, res) => {
  res.send("Login User");
});

export default router;
