const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
    patientName: {
        type: String,
        required: true
    },
    diseases: {
        type: [String],
        required: true
    },
    allergies: {
        type: [String],
        required: true
    },
    roomNumber: {
        type: String,
        required: true
    },
    bedNumber: {
        type: String,
        required: true
    },
    floorNumber: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true
    },
    gender: {
        type: String,
        required: true
    },
    emergencyContact: {
        type: String,
        required: true
    },
    admissionDate: {
        type: Date,
        default: Date.now
    },
    dischargeDate: {
        type: Date
    },
    notes: {
        type: String
    },
    foodIds:[{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Food'
        }],
});

const Patient = mongoose.model('Patient', patientSchema);

module.exports = Patient;