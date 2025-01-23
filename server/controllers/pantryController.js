const express = require('express');
const mongoose = require('mongoose');
const PantryStaff = require('../models/pantryStaff'); // Adjust the path as necessary

const router = express.Router();

// Create a new pantry staff
exports.createPantryStaff = async (req, res) => {
    try {
        const pantryStaff = new PantryStaff(req.body);
        await pantryStaff.save();
        res.status(201).send(pantryStaff);
    } catch (error) {
        res.status(400).send(error);
    }
};

// Get all pantry staff
exports.getAllPantryStaff = async (req, res) => {
    try {
        const pantryStaff = await PantryStaff.find();
        res.status(200).send(pantryStaff);
    } catch (error) {
        res.status(500).send(error);
    }
};

// Get a specific pantry staff by ID
exports.getPantryStaffById = async (req, res) => {
    try {
        const pantryStaff = await PantryStaff.findById(req.params.id);
        if (!pantryStaff) {
            return res.status(404).send();
        }
        res.status(200).send(pantryStaff);
    } catch (error) {
        res.status(500).send(error);
    }
};

// Update a pantry staff by ID
exports.updatePantryStaffById = async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['staffName', 'role', 'tasks'];
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' });
    }

    try {
        const pantryStaff = await PantryStaff.findById(req.params.id);

        if (!pantryStaff) {
            return res.status(404).send();
        }

        updates.forEach((update) => pantryStaff[update] = req.body[update]);
        await pantryStaff.save();
        res.status(200).send(pantryStaff);
    } catch (error) {
        res.status(400).send(error);
    }
};

// Delete a pantry staff by ID
exports.deletePantryStaffById = async (req, res) => {
    try {
        const pantryStaff = await PantryStaff.findByIdAndDelete(req.params.id);

        if (!pantryStaff) {
            return res.status(404).send();
        }

        res.status(200).send(pantryStaff);
    } catch (error) {
        res.status(500).send(error);
    }
};
