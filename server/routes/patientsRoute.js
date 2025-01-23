

const express = require('express');
const {
  getAllPatients,
  getPatientById,
  createPatient,
  updatePatientById,
  deletePatientById,
  addFoodToPatientAndUpdateFood,
  removeFoodFromPatientAndUpdateFood,
} = require('../controllers/patientsController');
const { authenticateUserByRole } = require('../middleware/authenticateUserByRole');
const { authorizeRoles } = require('../middleware/authorizeRoles');

const router = express.Router();

// Routes

// Route to get all patients (Accessible to both managers and food preparation staff)
router.get('/patient/',  getAllPatients);

// Route to get a single patient by ID (Accessible to both managers and food preparation staff)
router.get('/patient/:id', getPatientById);

// Route to create a new patient (Accessible only to managers)
router.post('/patient/', authenticateUserByRole, authorizeRoles(['manager']), createPatient);

// Route to update a patient by ID (Accessible only to managers)
router.put('/patient/:id', authenticateUserByRole, authorizeRoles(['manager']), updatePatientById);

// Route to add food to a patient and update the food inventory (Accessible only to managers)
router.put(
  '/patient/:patientId/add-food',
  authenticateUserByRole,
  authorizeRoles(['manager']),
  addFoodToPatientAndUpdateFood
);

// Route to remove food from a patient and update the food inventory (Accessible only to managers)
router.put(
  '/patient/:patientId/remove-food',
  authenticateUserByRole,
  authorizeRoles(['manager']),
  removeFoodFromPatientAndUpdateFood
);

// Route to delete a patient by ID (Accessible only to managers)
router.delete('/patient/:id', authenticateUserByRole, authorizeRoles(['manager']), deletePatientById);

module.exports = router;
