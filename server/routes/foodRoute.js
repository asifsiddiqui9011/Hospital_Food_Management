// const express = require('express');
// const foodController = require('../controllers/foodController');
// const {authenticateManager} = require('../middleware/authenticateUserByRole');
// const router = express.Router();

// // Route to get all food items
// router.get('/food', foodController.getAllFood);

// // Route to get a single food item by ID
// router.get('/food/:id', foodController.getFoodById);

// // Route to create a new food item
// router.post('/food', authenticateManager,foodController.createFood);

// // Route to update a food item by ID
// router.put('/food/:id', authenticateManager,foodController.updateFood);

// // Route to delete a food item by ID
// router.delete('/food/:id', authenticateManager,foodController.deleteFood);

// module.exports = router;

const express = require('express');
const foodController = require('../controllers/foodController');
const { authenticateUserByRole } = require('../middleware/authenticateUserByRole');
const { authorizeRoles } = require('../middleware/authorizeRoles');
const router = express.Router();

// Route to get all food items (Accessible to all authenticated users)
router.get('/food',  foodController.getAllFood);

// Route to get a single food item by ID (Accessible to all authenticated users)
router.get('/food/:id', foodController.getFoodById);

// Route to create a new food item (Accessible only to managers)
router.post('/food', authenticateUserByRole, authorizeRoles(['manager']), foodController.createFood);

// Route to update a food item by ID (Accessible only to managers)
router.put('/food/:id', authenticateUserByRole, authorizeRoles(['manager']), foodController.updateFood);

// Route to delete a food item by ID (Accessible only to managers)
router.delete('/food/:id', authenticateUserByRole, authorizeRoles(['manager']), foodController.deleteFood);

module.exports = router;
