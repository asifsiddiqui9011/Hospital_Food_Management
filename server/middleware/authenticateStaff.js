const jwt = require('jsonwebtoken');
const PantryStaff = require('../models/pantryStaff');
const JWT_SECRET = process.env.JWT_SECRET;

exports.authenticateStaff = async (req, res, next) => {
  const token = req.headers.authorization;
  
  console.log("Token:", token); // Debugging
  // Check if the token is provided
  if (!token) {
    console.error("No token provided in the headers.");
    return res.status(401).json({ message: "Authentication failed. No token provided." });
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token.replace("Bearer ", ""), JWT_SECRET);

    console.log("Decoded Token:", decoded); // Debugging the decoded payload

    // Fetch user from database
    const user = await PantryStaff.findById(decoded.id).select("-password");
    if (!user) {
      console.error("User not found in the database for the decoded ID:", decoded.id);
      throw new Error("User not found");
    }

    console.log("Authenticated User:", user); // Debugging the authenticated user

    req.user = user; // Attach user object to request
    next(); // Pass control to the next middleware
  } catch (error) {
    console.error("Authentication error:", error.message);
    return res.status(401).json({ message: "Authentication failed", error: error.message });
  }
};


