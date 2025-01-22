const Food = require('../models/food');
const Patient = require('../models/patients');
const MealTask = require('../models/mealTask');
const mongoose = require('mongoose');
// Helper function to check required fields
const validateRequiredFields = (body, requiredFields) => {
    for (const field of requiredFields) {
        if (!body[field]) {
            return `Field ${field} is required.`;
        }
    }
    return null;
};

const handleErrorResponse = (res, error, statusCode = 400) => {
    res.status(statusCode).json({ message: error.message || error });
};

// Create a new food entry
exports.createFood = async (req, res) => {
    const requiredFields = [ 'mealType', 'ingredients', 'instructions'];
    const validationError = validateRequiredFields(req.body, requiredFields);
    if (validationError) {
        return handleErrorResponse(res, validationError);
    }

    try {
        const food = new Food(req.body);
        await food.save();
        res.status(201).json(food);
    } catch (error) {
        handleErrorResponse(res, error);
    }
};

// Get all food entries
exports.getAllFood = async (req, res) => {
    try {
        const foods = await Food.find().populate('patientIds preparationStaff deliveryStaff');
        res.status(200).json(foods);
    } catch (error) {
        handleErrorResponse(res, error, 500);
    }
};

// Get a single food entry by ID
exports.getFoodById = async (req, res) => {
    try {
        const food = await Food.findById(req.params.id).populate('patientIds preparationStaff deliveryStaff');
        if (!food) {
            return handleErrorResponse(res, 'Food not found', 404);
        }
        res.status(200).json(food);
    } catch (error) {
        handleErrorResponse(res, error, 500);
    }
};

// Update a food entry by ID
exports.updateFood = async (req, res) => {
    const requiredFields = [ 'mealType', 'ingredients', 'instructions'];
    const validationError = validateRequiredFields(req.body, requiredFields);
    if (validationError) {
        return handleErrorResponse(res, validationError);
    }

    try {
        const food = await Food.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!food) {
            return handleErrorResponse(res, 'Food not found', 404);
        }
        res.status(200).json(food);
    } catch (error) {
        handleErrorResponse(res, error);
    }
};


exports.deleteFood = async (req, res) => {
    const session = await mongoose.startSession(); // Start a new session
    session.startTransaction(); // Start the transaction
  
    try {
      const food = await Food.findByIdAndDelete(req.params.id).session(session);
  
      if (!food) {
        await session.abortTransaction(); // Abort the transaction if food is not found
        session.endSession();
        return res.status(404).json({ message: "Food not found" });
      }
  
      // Remove references to the food ID in Patient and MealTask models
      await Patient.updateMany(
        { foodIds: req.params.id },
        { $pull: { foodIds: req.params.id } },
        { session }
      );
  
      await MealTask.updateMany(
        { foodId: req.params.id },
        { $unset: { foodId: "" } },
        { session }
      );
  
      // Commit the transaction
      await session.commitTransaction();
      session.endSession();
  
      res.status(200).json({ message: "Food deleted successfully" });
    } catch (error) {
      // Only abort the transaction if it hasn't been committed
      if (session.inTransaction()) {
        await session.abortTransaction();
      }
      session.endSession();
  
      console.error("Error deleting food:", error);
      res.status(500).json({ message: "Failed to delete food item", error });
    }
  };
  