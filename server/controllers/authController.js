const jwt = require("jsonwebtoken");
// const User = require("../models/User");
const PantryStaff = require("../models/pantryStaff");
const JWT_SECRET = process.env.JWT_SECRET; // Ensure this is defined in your environment variables


//api end point to register users based on the role
exports.register = async (req, res) => {
  const { email, password, role, staffName } = req.body;

  try {
    // Role-specific registration
    if (role === "manager") {
      // Check if the manager already exists in the User collection
      const existingUser = await User.findOne({ email });
      if (existingUser) return res.status(400).json({ message: "Manager already exists" });

      // Save manager in the User model
      const newUser = new User({ email, password, role });
      await newUser.save();

      // Generate JWT Token
      const token = jwt.sign({ id: newUser._id, role: newUser.role }, JWT_SECRET, { expiresIn: '7d' });

      res.status(201).json({
        message: "Manager registered successfully",
        user: { id: newUser._id, email: newUser.email, role: newUser.role },
        token,
      });
    } else {
      // Check if staff already exists in the PantryStaff collection
      const existingStaff = await PantryStaff.findOne({ email });
      if (existingStaff) return res.status(400).json({ message: "Staff already exists with this email" });

      // Validate required fields for Pantry Staff
      if (!staffName || !email || !password) {
        return res.status(400).json({ message: "Staff Name, Email, and Password are required" });
      }

      // Save staff in the PantryStaff model
      const newStaff = new PantryStaff({ staffName, email, password, role });
      await newStaff.save();

      // Generate JWT Token
      const token = jwt.sign({ id: newStaff._id, role: newStaff.role }, JWT_SECRET, { expiresIn: '7d' });

      res.status(201).json({
        message: "Pantry Staff registered successfully",
        user: { id: newStaff._id, staffName: newStaff.staffName, email: newStaff.email, role: newStaff.role },
        token,
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// exports.login = async (req, res) => {
//   const { email, password, contactInfo } = req.body;

//   try {
//     let user, token;

//     if (email) {
//       // Login for managers
//       user = await User.findOne({ email });
//       if (!user) return res.status(404).json({ message: "User not found" });

//       const isMatch = await user.comparePassword(password);
//       if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

//       token = generateToken(user);
//     } else if (contactInfo) {
//       // Login for pantry staff using contact info
//       user = await PantryStaff.findOne({ contactInfo });
//       if (!user) return res.status(404).json({ message: "Staff not found" });

//       // No password check for staff; can be implemented if needed

//       // Create token manually for pantry staff
//       token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "7d" });
//     } else {
//       return res.status(400).json({ message: "Email or Contact Info is required for login" });
//     }

//     res.status(200).json({ success:true ,token, role: user.role });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };


// const JWT_SECRET = process.env.JWT_SECRET;

//login api end point
exports.login = async (req, res) => {
  const { email, password, role } = req.body;

  try {
    if (!email || !password || !role) {
      return res.status(400).json({ message: "Email, Password, and Role are required for login" });
    }

    let user, token;

    if (role === "manager") {
      // If role is manager, find the user in the User model
      user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ message: "Manager not found" });
      }

      // Authenticate manager
      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      // Generate JWT for manager
      token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: "7d" });

      return res.status(200).json({
        success: true,
        message: "Manager login successful",
        token,
        user: { id: user._id, email: user.email, role: user.role },
      });
    }

    if (role === "Food_Preparation" || role === "Delivery") {
      // If role is Food Preparation or Delivery, find the user in the PantryStaff model
      user = await PantryStaff.findOne({ email });
      if (!user) {
        return res.status(404).json({ message: `${role} not found` });
      }

      // Authenticate pantry staff
      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      // Generate JWT for pantry staff
      token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: "7d" });

      return res.status(200).json({
        success: true,
        message: `${role} login successful`,
        token,
        user: { id: user._id, email: user.email, role: user.role, staffName: user.staffName },
      });
    }

    return res.status(400).json({ message: "Invalid role" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
