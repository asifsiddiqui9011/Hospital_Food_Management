// const express = require('express');
// const pantryController = require('../controllers/pantryController');

// const router = express.Router();

// // Route to get all pantry items
// router.get('/pantrystaff', pantryController.getAllPantryStaff);

// // Route to get a single pantry item by ID
// router.get('/pantrystaff/:id', pantryController.getPantryStaffById);

// // Route to add a new pantry item
// router.post('/pantrystaff', pantryController.createPantryStaff);

// // Route to update a pantry item by ID
// router.put('/pantrystaff/:id', pantryController.updatePantryStaffById);

// // Route to delete a pantry item by ID
// router.delete('/pantrystaff/:id', pantryController.deletePantryStaffById);

// module.exports = router;


const express = require('express');
const pantryController = require('../controllers/pantryController');
const { authenticateUserByRole } = require('../middleware/authenticateUserByRole');
const { authorizeRoles } = require('../middleware/authorizeRoles');

const router = express.Router();

// Route to get all pantry staff (Accessible only to managers)
router.get('/pantrystaff',  pantryController.getAllPantryStaff);

// Route to get a single pantry staff by ID (Accessible to both managers and staff themselves)
router.get('/pantrystaff/:id', pantryController.getPantryStaffById);

// Route to add a new pantry staff (Accessible only to managers)
router.post('/pantrystaff', authenticateUserByRole, authorizeRoles(['manager']), pantryController.createPantryStaff);

// Route to update a pantry staff by ID (Accessible only to managers)
router.put('/pantrystaff/:id', authenticateUserByRole, authorizeRoles(['manager']), pantryController.updatePantryStaffById);

// Route to delete a pantry staff by ID (Accessible only to managers)
router.delete('/pantrystaff/:id', authenticateUserByRole, authorizeRoles(['manager']), pantryController.deletePantryStaffById);

module.exports = router;
