const express = require('express');
const Patient = require('../models/patients'); // Assuming you have a patient model schema

const Food = require("../models/food");
const router = express.Router();

// Middleware to check for required fields before creating or updating a patient
const checkRequiredFields = (req, res, next) => {
    const requiredFields = ['patientName', 'diseases', 'allergies', 'roomNumber', 'bedNumber', 'floorNumber', 'age', 'gender', 'emergencyContact'];
    const missingFields = requiredFields.filter(field => !req.body[field]);

    if (missingFields.length > 0) {
        return res.status(400).send({ error: `Missing required fields: ${missingFields.join(', ')}` });
    }

    next();
};

const createPatient = async (req, res) => {
    try {
        const patient = new Patient(req.body);
        await patient.save();
        res.status(201).send(patient);
    } catch (error) {
        res.status(400).send(error);
    }
};

const getAllPatients = async (req, res) => {
    try {
      const patients = await Patient.find({})
        .populate({
          path: 'foodIds',
          model: 'Food', // The model to use
          select: 'mealType ingredients instructions', // Specify the fields you want to include
        });
  
      res.status(200).send(patients);
      // console.log(patients,"patients")
    } catch (error) {
      res.status(500).send(error);
    }
  };
  

const getPatientById = async (req, res) => {
    try {
        const patient = await Patient.findById(req.params.id);
        if (!patient) {
            return res.status(404).send();
        }
        res.status(200).send(patient);
    } catch (error) {
        res.status(500).send(error);
    }
};

const updatePatientById = async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['patientName', 'diseases', 'allergies', 'roomNumber', 'bedNumber', 'floorNumber', 'age', 'gender', 'emergencyContact', 'admissionDate', 'dischargeDate', 'notes'];
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' });
    }

    try {
        const patient = await Patient.findById(req.params.id);
        if (!patient) {
            return res.status(404).send();
        }

        updates.forEach((update) => (patient[update] = req.body[update]));
        await patient.save();
        res.status(200).send(patient);
    } catch (error) {
        res.status(400).send(error);
    }
};

const deletePatientById = async (req, res) => {
    try {
        const patient = await Patient.findByIdAndDelete(req.params.id);
        if (!patient) {
            return res.status(404).send();
        }
        res.status(200).send(patient);
    } catch (error) {
        res.status(500).send(error);
    }
};




const addFoodToPatientAndUpdateFood = async (req, res) => {
  const { patientId } = req.params; // Get patient ID and food ID from URL
  const {foodId} = req.body
  if (!foodId) {
    return res.status(400).json({ message: "Food ID is required in the request parameters." });
  }

  try {
    // Step 1: Add the food ID to the patient document
    const patient = await Patient.findByIdAndUpdate(
      patientId,
      { $addToSet: { foodIds: foodId } }, // Add only unique food ID
      { new: true } // Return the updated document
    );

    if (!patient) {
      return res.status(404).json({ message: "Patient not found." });
    }

    // Step 2: Add the patient ID to the food document
    const food = await Food.findByIdAndUpdate(
      foodId,
      { $addToSet: { patientIds: patientId } }, // Add only unique patient ID
      { new: true } // Return the updated document
    );

    if (!food) {
      return res.status(404).json({ message: "Food not found." });
    }

    res.status(200).json({
      message: "Food ID added successfully to the patient and patient ID updated in the food record.",
      patient,
      food,
    });
  } catch (error) {
    res.status(500).json({
      message: "An error occurred while updating the records.",
      error: error.message,
    });
  }
};


//remoremove Food From Patient And Update Food
const removeFoodFromPatientAndUpdateFood = async (req, res) => {
  const { patientId } = req.params;
  const { foodId } = req.body;

  if (!foodId) {
    return res.status(400).json({ message: "Food ID is required in the request body." });
  }

  try {
    // Remove food ID from the patient
    const patient = await Patient.findByIdAndUpdate(
      patientId,
      { $pull: { foodIds: foodId } },
      { new: true }
    );

    if (!patient) {
      return res.status(404).json({ message: "Patient not found." });
    }

    // Remove patient ID from the food
    const food = await Food.findByIdAndUpdate(
      foodId,
      { $pull: { patientIds: patientId } },
      { new: true }
    );

    if (!food) {
      return res.status(404).json({ message: "Food not found." });
    }

    res.status(200).json({
      message: "Food successfully removed from patient and records updated.",
      patient,
      food,
    });
  } catch (error) {
    res.status(500).json({
      message: "An error occurred while removing the food.",
      error: error.message,
    });
  }
};





module.exports = {
    createPatient,
    getAllPatients,
    getPatientById,
    updatePatientById,
    deletePatientById,
    checkRequiredFields,
    addFoodToPatientAndUpdateFood,
    removeFoodFromPatientAndUpdateFood
};
