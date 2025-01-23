/**
 * Role-based authorization middleware
 * @param {Array} allowedRoles - List of roles allowed to access the route
 */
exports.authorizeRoles = (allowedRoles) => {
  return (req, res, next) => {
    const userRole = req.user.role; // Role from the authenticated user object

    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({
        message: "Access forbidden: You do not have permission to perform this action",
      });
    }

    next(); // User is authorized, proceed to the next middleware/controller
  };
};
