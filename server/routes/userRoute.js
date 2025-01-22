const express = require("express");
const { register, login } = require("../controllers/authController");

const router = express.Router();

// Auth Routes
router.post("/register", register); // Register users
router.post("/login", login);       // Login users

module.exports = router;
