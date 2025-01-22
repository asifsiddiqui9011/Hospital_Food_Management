const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;

const User = require("../models/User");
const pantryStaff = require("../models/pantryStaff")

// Authentication Middleware
exports.authenticate = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Authentication failed. No token provided." });

  try {
    const decoded = jwt.verify(token,JWT_SECRET);
    req.user = await User.findById(decoded.id).select("-password"); // Attach user to request
    if (!req.user) throw new Error("User not found");
    next();
  } catch (error) {
    res.status(401).json({ message: "Authentication failed" });
  }
};

// Role-Based Authorization Middleware
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Forbidden. You do not have access to this resource." });
    }
    next();
  };
};
