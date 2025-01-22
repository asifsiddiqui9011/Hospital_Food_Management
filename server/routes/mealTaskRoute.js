const express = require('express');
const mealTaskController = require('../controllers/mealTaskController');
const {authenticateStaff} = require('../middleware/authenticateStaff');
const authenticateManager = require('../middleware/authenticateManager');
const router = express.Router();

// Define routes
router.get('/meals', mealTaskController.getAllMealTasks);
router.get('/meals/:id', mealTaskController.getMealTaskById);
router.get('/meals/food/:foodId/delivery-status',mealTaskController.getMealTaskDeliveryStatus)
router.get('/mealss', authenticateStaff,mealTaskController.getMealTasksAssignedToDeliveryStaff);

router.post('/meals',authenticateManager, mealTaskController.createMealTask);

router.put('/meals/:id', mealTaskController.updateMealTask);

router.delete('/meals/:id',authenticateManager, mealTaskController.deleteMealTask);


router.put("/meals/:mealTaskId/assign-delivery-staff",authenticateManager,mealTaskController.assignDeliveryStaff);
router.put("/meals/:mealTaskId/assign-preparation-staff",authenticateManager,mealTaskController.assignPreparationStaff);
router.put('/meals/:mealTaskId/remove-preparation-staff',authenticateManager, mealTaskController.removePreparationStaff);
router.put('/meals/:mealTaskId/remove-delivery-staff',authenticateManager, mealTaskController.removeDeliveryStaff);
router.put('/meals/:mealTaskId/preparation-status',authenticateStaff,mealTaskController.updatePreparationStatus);
router.patch('/meals/:mealTaskId/update-delivery-status/:patientId',authenticateStaff,mealTaskController.updatePatientDeliveryStatus);
router.put("/meals/:mealTaskId/mark-out-for-delivery", mealTaskController.markAllOutForDelivery);




module.exports = router;