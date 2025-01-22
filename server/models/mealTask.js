const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const deliveryStatusSchema = new Schema({
    patientId: {
        type: Schema.Types.ObjectId,
        ref: 'Patient',
        required: true
    },
    status: {
        type: String,
        enum: ['Pending', 'Out for Delivery', 'Delivered', 'Failed'],
        default: 'Pending'
    }
});

const mealTaskSchema = new Schema({
    foodId: {
        type: Schema.Types.ObjectId,
        ref: 'Food',
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    preparationStatus: {
        type: String,
        enum: ['Pending', 'In Progress', 'Prepared'],
        default: 'Pending'
    },
    deliveryStatuses: [deliveryStatusSchema],
    deliveryStaff: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'PantryStaff'
        }],
    preparationStaff: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'PantryStaff'
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const MealTask = mongoose.model('MealTask', mealTaskSchema);

module.exports = MealTask;
