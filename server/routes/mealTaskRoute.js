// const express = require('express');
// const mealTaskController = require('../controllers/mealTaskController');
// const { authenticateStaff } = require('../middleware/authorizeRoles');
// const { authenticateManager } = require('../middleware/authenticateUserByRole');
// const router = express.Router();

// function authenticateEither(authenticateStaff, authenticateManager) {
//     return async (req, res, next) => {
//         try {
//             await new Promise((resolve, reject) => {
//                 authenticateStaff(req, res, (err) => {
//                     if (!err) {
//                         resolve();
//                     } else {
//                         reject();
//                     }
//                 });
//             });
//             return next();
//         } catch (err) {
//             console.log("Authentication error: Staff user not found, attempting manager authentication...");
//             try {
//                 await new Promise((resolve, reject) => {
//                     authenticateManager(req, res, (err) => {
//                         if (!err) {
//                             resolve();
//                         } else {
//                             reject();
//                         }
//                     });
//                 });
//                 return next();
//             } catch (err) {
//                 console.log("Authentication error: Manager user not found");
//                 return res.status(403).send('Forbidden');
//             }
//         }
//     };
// }


// // Define routes
// router.get('/meals', mealTaskController.getAllMealTasks);
// router.get('/meals/:id', mealTaskController.getMealTaskById);
// router.get('/meals/food/:foodId/delivery-status', mealTaskController.getMealTaskDeliveryStatus);
// router.get('/mealss', authenticateStaff, mealTaskController.getMealTasksAssignedToDeliveryStaff);

// router.post('/meals', authenticateManager, mealTaskController.createMealTask);

// router.put('/meals/:id', authenticateEither(authenticateStaff, authenticateManager), mealTaskController.updateMealTask);

// router.delete('/meals/:id', authenticateManager, mealTaskController.deleteMealTask);

// router.put("/meals/:mealTaskId/assign-delivery-staff", authenticateManager, mealTaskController.assignDeliveryStaff);
// router.put("/meals/:mealTaskId/assign-preparation-staff", authenticateManager, mealTaskController.assignPreparationStaff);
// router.put('/meals/:mealTaskId/remove-preparation-staff', authenticateManager, mealTaskController.removePreparationStaff);
// router.put('/meals/:mealTaskId/remove-delivery-staff', authenticateManager, mealTaskController.removeDeliveryStaff);
// router.put('/meals/:mealTaskId/preparation-status', authenticateEither(authenticateStaff, authenticateManager), mealTaskController.updatePreparationStatus);

// router.patch('/meals/:mealTaskId/update-delivery-status/:patientId', authenticateStaff, mealTaskController.updatePatientDeliveryStatus);
// router.put("/meals/:mealTaskId/mark-out-for-delivery", mealTaskController.markAllOutForDelivery);

// module.exports = router;


const express = require("express");
const router = express.Router();
const { authenticateUserByRole } = require("../middleware/authenticateUserByRole");
const { authorizeRoles } = require("../middleware/authorizeRoles");
const mealTaskController = require("../controllers/mealTaskController");

// Define routes
router.get('/meals',  mealTaskController.getAllMealTasks);

router.get('/meals/:id', mealTaskController.getMealTaskById);

router.get(
  '/meals/food/:foodId/delivery-status',
  authenticateUserByRole,
  authorizeRoles(["manager", "Delivery"]),
  mealTaskController.getMealTaskDeliveryStatus
);

router.get(
  '/mealsToDeliveryStaff',
  authenticateUserByRole,
  authorizeRoles(["manager","Delivery"]),
  mealTaskController.getMealTasksAssignedToDeliveryStaff
);

router.get(
  '/mealsToPreparationStaff',
  authenticateUserByRole,
  authorizeRoles(["manager","Food_Preparation"]),
  mealTaskController.getMealTasksAssignedToPreparationStaff
);

router.post(
  '/meals',
  authenticateUserByRole,
  authorizeRoles(["manager"]),
  mealTaskController.createMealTask
);

router.put(
  '/meals/:id',
  authenticateUserByRole,
  authorizeRoles(["manager", "Food_Preparation", "Delivery"]),
  mealTaskController.updateMealTask
);

router.delete(
  '/meals/:id',
  authenticateUserByRole,
  authorizeRoles(["manager"]),
  mealTaskController.deleteMealTask
);

router.put(
  "/meals/:mealTaskId/assign-delivery-staff",
  authenticateUserByRole,
  authorizeRoles(["manager"]),
  mealTaskController.assignDeliveryStaff
);

router.put(
  "/meals/:mealTaskId/assign-preparation-staff",
  authenticateUserByRole,
  authorizeRoles(["manager"]),
  mealTaskController.assignPreparationStaff
);

router.put(
  '/meals/:mealTaskId/remove-preparation-staff',
  authenticateUserByRole,
  authorizeRoles(["manager"]),
  mealTaskController.removePreparationStaff
);

router.put(
  '/meals/:mealTaskId/remove-delivery-staff',
  authenticateUserByRole,
  authorizeRoles(["manager"]),
  mealTaskController.removeDeliveryStaff
);

router.put(
  '/meals/:mealTaskId/preparation-status',
  authenticateUserByRole,
  authorizeRoles(["manager", "Food_Preparation"]),
  mealTaskController.updatePreparationStatus
);

router.patch(
  '/meals/:mealTaskId/update-delivery-status/:patientId',
  authenticateUserByRole,
  authorizeRoles(["manager", "Delivery"]),
  mealTaskController.updatePatientDeliveryStatus
);

router.put(
  "/meals/:mealTaskId/mark-out-for-delivery",
  authenticateUserByRole,
  authorizeRoles(["manager", "Delivery"]),
  mealTaskController.markAllOutForDelivery
);

module.exports = router;
