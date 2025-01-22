const express = require('express');
const { getAllPatients, getPatientById, createPatient, updatePatientById,deletePatientById,addFoodToPatientAndUpdateFood,removeFoodFromPatientAndUpdateFood} = require('../controllers/patientsController');
const authenticateManager = require('../middleware/authenticateManager');
const router = express.Router();

// Controller functions (you need to implement these)

// Routes
router.get('/patient/', getAllPatients);

router.get('/patient/:id', getPatientById);
router.post('/patient/',authenticateManager, createPatient);
router.put('/patient/:id',authenticateManager, updatePatientById,);
router.put("/patient/:patientId/add-food",authenticateManager, addFoodToPatientAndUpdateFood);
router.put("/patient/:patientId/remove-food", authenticateManager,removeFoodFromPatientAndUpdateFood);
router.delete('/patient/:id', authenticateManager,deletePatientById);

module.exports = router;