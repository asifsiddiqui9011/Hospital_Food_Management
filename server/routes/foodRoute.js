const express = require('express');
const foodController = require('../controllers/foodController');
const authenticateManager = require('../middleware/authenticateManager');
const router = express.Router();

// Route to get all food items
router.get('/food', foodController.getAllFood);

// Route to get a single food item by ID
router.get('/food/:id', foodController.getFoodById);

// Route to create a new food item
router.post('/food', authenticateManager,foodController.createFood);

// Route to update a food item by ID
router.put('/food/:id', authenticateManager,foodController.updateFood);

// Route to delete a food item by ID
router.delete('/food/:id', authenticateManager,foodController.deleteFood);

module.exports = router;