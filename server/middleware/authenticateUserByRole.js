const jwt = require("jsonwebtoken");
const User = require("../models/User");
const PantryStaff = require("../models/pantryStaff");
const JWT_SECRET = process.env.JWT_SECRET;

/**
 * Middleware to authenticate users based on their role.
 * Validates the JWT and checks for the user's role and existence in the appropriate collection.
 */
exports.authenticateUserByRole = async (req, res, next) => {
  const token = req.headers.authorization;

  // Check if token is provided
  if (!token) {
    return res.status(401).json({ message: "Authentication failed. No token provided." });
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token.replace("Bearer ", ""), JWT_SECRET);
    const { id, role } = decoded;

    console.log("Decoded Token:", decoded); // Debugging

    // Dynamically fetch the user based on role
    let user;
    if (role === "manager") {
      user = await User.findById(id).select("-password"); // Fetch manager from User collection
    } else if (role === "Food_Preparation" || role === "Delivery") {
      user = await PantryStaff.findById(id).select("-password"); // Fetch pantry staff from PantryStaff collection
    }

    // Check if user exists
    if (!user) {
      return res.status(404).json({ message: `${role} user not found` });
    }

    console.log("Authenticated User:", user); // Debugging the authenticated user

    req.user = user; // Attach user object to the request
    next(); // Pass control to the next middleware
  } catch (error) {
    console.error("Authentication error:", error.message);
    return res.status(401).json({ message: "Authentication failed", error: error.message });
  }
};
