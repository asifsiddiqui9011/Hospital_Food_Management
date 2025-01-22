const MealTask = require('../models/mealTask');
const PantryStaff = require('../models/pantryStaff');
// Create a new meal task
const Food = require('../models/food');
const Patient = require('../models/patients');
const mongoose = require("mongoose");


// API to create a Meal Task
exports.createMealTask = async (req, res) => {
    const { foodId, preparationStatus = 'Pending', deliveryStaff } = req.body;

    try {
        // Fetch food data to extract patientIds
        const food = await Food.findById(foodId).populate('patientIds');

        if (!food) {
            return res.status(404).json({ error: 'Food not found' });
        }

        // Calculate quantity based on the number of patient IDs
        const quantity = food.patientIds.length;

        // Map patientIds to the deliveryStatuses format
        const deliveryStatuses = food.patientIds.map(patientId => ({
            patientId,
            status: 'Pending', // Default status
        }));

        // Create a new meal task
        const mealTask = new MealTask({
            foodId,
            quantity, // Assign the calculated quantity here
            preparationStatus, // Default or user-provided preparationStatus
            deliveryStatuses,
            deliveryStaff,
        });

        // Save the meal task to the database
        await mealTask.save();

        res.status(201).json({ message: 'Meal Task created successfully', mealTask });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};


exports.getAllMealTasks = async (req, res) => {
    try {
        const mealTasks = await MealTask.find()
            .populate('foodId')
            .populate('deliveryStatuses.patientId')
            .populate('preparationStaff', 'staffName role') // Populate preparationStaff with their names
            .populate('deliveryStaff', 'staffName role'); // Populate deliveryStaff with their names

        res.status(200).json(mealTasks);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getMealTasksAssignedToDeliveryStaff = async (req, res) => {
   
      try {
        const deliveryStaffId = req.user.id; // Assuming `req.user` contains the authenticated user data
        console.log(deliveryStaffId,"delid");
        if (!deliveryStaffId) {
          return res.status(400).json({ message: "Delivery staff ID is missing." });
        }

        const mealTasks = await MealTask.find({ deliveryStaff: deliveryStaffId })
          .populate("foodId")
          .populate("deliveryStatuses.patientId")
          .populate("preparationStaff", "staffName role")
          .populate("deliveryStaff", "staffName role");
    
        // If no tasks found, return a 404 response
        if (!mealTasks || mealTasks.length === 0) {
          return res
            .status(404)
            .json({ message: "No meal tasks assigned to this delivery staff." });
        }
    
        res.status(200).json(mealTasks);
      } catch (error) {
        res.status(500).json({ message: error.message });
      }
    };
    
  

// Get a single meal task by ID
exports.getMealTaskById = async (req, res) => {
    try {
        const mealTask = await MealTask.findById(req.params.id).populate('foodId').populate('deliveryStatuses.patientId');
        if (!mealTask) {
            return res.status(404).json({ message: 'Meal Task not found' });
        }
        res.status(200).json(mealTask);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update a meal task by ID
exports.updateMealTask = async (req, res) => {
    try {
        const mealTask = await MealTask.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!mealTask) {
            return res.status(404).json({ message: 'Meal Task not found' });
        }
        res.status(200).json(mealTask);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete a meal task by ID
exports.deleteMealTask = async (req, res) => {
    try {
        const mealTask = await MealTask.findByIdAndDelete(req.params.id);
        if (!mealTask) {
            return res.status(404).json({ message: 'Meal Task not found' });
        }
        res.status(200).json({ message: 'Meal Task deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// Update patient delivery status
exports.updatePatientDeliveryStatus= async (req, res) => {
    const { mealTaskId, patientId } = req.params;
    const { status } = req.body;

    // Validate the input status
    const validStatuses = ['Pending', 'Out for Delivery', 'Delivered', 'Failed'];
   
    if (!validStatuses.includes(status)) {
        return res.status(400).json({ message: 'Invalid status value' });
    }

    try {
        // Find the MealTask and update the delivery status of the specific patient
        const mealTask = await MealTask.findById(mealTaskId);
        if (!mealTask) {
            return res.status(404).json({ message: 'MealTask not found' });
        }

        const deliveryStatus = mealTask.deliveryStatuses.find(
            (status) => status.patientId.toString() === patientId
        );

        if (!deliveryStatus) {
            return res.status(404).json({ message: 'Delivery status for the patient not found' });
        }

        // Update the status
        deliveryStatus.status = status;

        // Save the updated MealTask
        await mealTask.save();

        res.status(200).json({
            message: 'Patient delivery status updated successfully',
            updatedDeliveryStatus: deliveryStatus,
            updatedMealTask: mealTask,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error', error });
    }
};

// Update preparation statusSS
exports.updatePreparationStatus = async (req, res) => {
    const { mealTaskId } = req.params;
    const { preparationStatus } = req.body;

    // Validate preparation status
    const validStatuses = ['Pending', 'In Progress', 'Prepared'];
    if (!validStatuses.includes(preparationStatus)) {
        return res.status(400).json({ message: 'Invalid preparation status value' });
    }

    try {
        // Check if the user is a food preparation staff
        const userId = req.user.id; // Assuming user ID is stored in req.user after authentication
        const staff = await PantryStaff.findById(userId);
        if (!staff || staff.role !== 'Food_Preparation') {
            return res.status(403).json({ message: 'Unauthorized: Only food preparation staff can update preparation status.' });
        }

        // Find the meal task
        const mealTask = await MealTask.findById(mealTaskId);
        if (!mealTask) {
            return res.status(404).json({ message: 'MealTask not found' });
        }

        // Update preparation status
        mealTask.preparationStatus = preparationStatus;
        await mealTask.save();

        res.status(200).json({
            message: 'Preparation status updated successfully',
            updatedMealTask: mealTask,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error', error });
    }
};





exports.getMealTaskDeliveryStatus = async (req, res) => {
  const { foodId } = req.params;

  try {
    // Validate that the food exists
    const mealTask = await MealTask.findOne({ foodId });

    if (!mealTask) {
      return res.status(404).json({ message: 'No meal task found for this food item' });
    }

    // Extract patient IDs from deliveryStatuses
    const patientIds = mealTask.deliveryStatuses.map((status) => status.patientId);

    // Fetch patient details for the extracted patient IDs
    const patients = await Patient.find({ _id: { $in: patientIds } })
      .select('patientName roomNumber bedNumber');

    // Map deliveryStatuses with patient details
    const deliveryStatusesWithDetails = mealTask.deliveryStatuses.map((status) => {
      const patient = patients.find((p) => p._id.toString() === status.patientId.toString());
      return {
        patientDetails: patient || null, // Include null if patient details are missing
        status: status.status,
      };
    });

    // Return the response
    res.status(200).json({
      foodId: mealTask.foodId,
      deliveryStatuses: deliveryStatusesWithDetails,
    });
  } catch (error) {
    console.error('Error fetching meal task delivery statuses:', error);
    res.status(500).json({ message: 'Internal Server Error', error });
  }
};




// Assign delivery staff to a meal task
exports.assignDeliveryStaff = async (req, res) => {
    const { mealTaskId } = req.params;
    const { staffId } = req.body;

    try {
        // Validate that the staff member exists and has the role of 'delivery'
        const staff = await PantryStaff.findById(staffId);
        if (!staff || staff.role !== "Delivery") {
            return res.status(400).json({ error: "Invalid delivery staff ID or role." });
        }

        // Update the meal task with the delivery staff ID
        const mealTask = await MealTask.findById(mealTaskId);
        if (!mealTask) {
            return res.status(404).json({ error: "Meal task not found." });
        }

        if (!mealTask.deliveryStaff.includes(staffId)) {
            mealTask.deliveryStaff.push(staffId);
            await mealTask.save();
        }

        res.status(200).json({ message: "Delivery staff assigned successfully.", mealTask });
    } catch (error) {
        console.error("Error assigning delivery staff:", error);
        res.status(500).json({ error: "Internal server error." });
    }
};

// Remove delivery staff from a meal task
exports.removeDeliveryStaff = async (req, res) => {
    const { mealTaskId } = req.params; // Extract mealTaskId from URL params
    const { staffId } = req.body;      // Extract staffId from request body

    try {
        // Validate input
        if (!mealTaskId || !staffId) {
            return res.status(400).json({ error: "MealTask ID and Staff ID are required." });
        }

        // Validate the staff member
        const staff = await PantryStaff.findById(staffId);
        if (!staff) {
            return res.status(404).json({ error: "Staff member not found." });
        }

        if (staff.role !== "Delivery") {
            return res.status(400).json({ error: "Staff member does not have the 'Delivery' role." });
        }

        // Validate the meal task
        const mealTask = await MealTask.findById(mealTaskId);
        if (!mealTask) {
            return res.status(404).json({ error: "Meal task not found." });
        }

        // Check if staff is assigned to the meal task
        const index = mealTask.deliveryStaff.indexOf(staffId);
        if (index === -1) {
            return res.status(400).json({ error: "Staff member is not assigned to this meal task." });
        }

        // Remove staff from the deliveryStaff array
        mealTask.deliveryStaff.splice(index, 1);
        await mealTask.save();

        // Respond with success
        res.status(200).json({
            message: "Delivery staff removed successfully.",
            mealTask,
        });

    } catch (error) {
        console.error("Error removing delivery staff:", error.message, error.stack);
        res.status(500).json({ error: "Internal server error." });
    }
};

// Assign preparation staff to a meal task
exports.assignPreparationStaff = async (req, res) => {
    const { mealTaskId } = req.params; // Extract mealTaskId from URL params
    const { staffId } = req.body;      // Extract staffId from request body

    try {
        // Validate input
        if (!mealTaskId || !staffId) {
            return res.status(400).json({ error: "MealTask ID and Staff ID are required." });
        }

        // Validate the staff member
        const staff = await PantryStaff.findById(staffId);
        if (!staff) {
            return res.status(404).json({ error: "Staff member not found." });
        }

        if (staff.role !== "Food_Preparation") {
            return res.status(400).json({ error: "Staff member does not have the 'Food Preparation' role." });
        }

        // Validate the meal task
        const mealTask = await MealTask.findById(mealTaskId);
        if (!mealTask) {
            return res.status(404).json({ error: "Meal task not found." });
        }

        // Check if staff is already assigned
        if (!mealTask.preparationStaff.includes(staffId)) {
            mealTask.preparationStaff.push(staffId);
            await mealTask.save();
        } else {
            return res.status(400).json({ error: "Staff member is already assigned to this meal task." });
        }

        // Respond with success
        res.status(200).json({
            message: "Preparation staff assigned successfully.",
            mealTask,
        });

    } catch (error) {
        console.error("Error assigning preparation staff:", error.message, error.stack);
        res.status(500).json({ error: "Internal server error." });
    }
};

// Remove preparation staff from a meal task
exports.removePreparationStaff = async (req, res) => {
    const { mealTaskId } = req.params; // Extract mealTaskId from URL params
    const { staffId } = req.body;      // Extract staffId from request body

    try {
        // Validate input
        if (!mealTaskId || !staffId) {
            return res.status(400).json({ error: "MealTask ID and Staff ID are required." });
        }

        // Validate the meal task
        const mealTask = await MealTask.findById(mealTaskId);
        if (!mealTask) {
            return res.status(404).json({ error: "Meal task not found." });
        }

        // Check if staff is assigned to the meal task
        const staffIndex = mealTask.preparationStaff.indexOf(staffId);
        if (staffIndex === -1) {
            return res.status(400).json({ error: "Staff member is not assigned to this meal task." });
        }

        // Remove the staff ID from the preparationStaff array
        mealTask.preparationStaff.splice(staffIndex, 1);
        await mealTask.save();

        // Respond with success
        res.status(200).json({
            message: "Preparation staff removed successfully.",
            mealTask,
        });

    } catch (error) {
        console.error("Error removing preparation staff:", error.message, error.stack);
        res.status(500).json({ error: "Internal server error." });
    }
};


//get maked out for delivery 
exports.markAllOutForDelivery = async (req, res) => {
    try {
      const mealTask = await MealTask.findById(req.params.mealTaskId);
      if (!mealTask) {
        return res.status(404).json({ message: "Meal task not found." });
      }
  
      mealTask.deliveryStatuses.forEach((status) => {
        if (status.status === "Pending") {
          status.status = "Out for Delivery";
        }
      });
  
      await mealTask.save();
      res.status(200).json(mealTask);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  