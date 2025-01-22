const express = require('express');
const pantryController = require('../controllers/pantryController');

const router = express.Router();

// Route to get all pantry items
router.get('/pantrystaff', pantryController.getAllPantryStaff);

// Route to get a single pantry item by ID
router.get('/pantrystaff/:id', pantryController.getPantryStaffById);

// Route to add a new pantry item
router.post('/pantrystaff', pantryController.createPantryStaff);

// Route to update a pantry item by ID
router.put('/pantrystaff/:id', pantryController.updatePantryStaffById);

// Route to delete a pantry item by ID
router.delete('/pantrystaff/:id', pantryController.deletePantryStaffById);

module.exports = router;