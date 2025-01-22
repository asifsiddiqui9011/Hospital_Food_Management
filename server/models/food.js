const mongoose = require('mongoose');
const Patient = require('./patients');
const PantryStaff = require('./pantryStaff');


const foodSchema = new mongoose.Schema({
    mealType:{
        type: String,
        enum: ['Morning', 'Evening', 'Night'],
        required: true
    },
    ingredients: {
        type: [String],
        required: true
    },
    instructions: {
        type: String,
        required: true
    },
    patientIds: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Patient'
    }],
    preparationStaff: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'PantryStaff'
    }],
    deliveryStaff: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'PantryStaff'
    }]
});

   

const Food = mongoose.model('Food', foodSchema);

module.exports = Food;
