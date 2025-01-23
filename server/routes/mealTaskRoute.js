

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
