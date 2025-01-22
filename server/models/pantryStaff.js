
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); // To hash passwords

const pantryStaffSchema = new mongoose.Schema({
    staffName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true // Ensures the email is unique
    },
    password: {
        type: String,
        required: true // Ensures a password is required
    },
    role: {
        type: String,
        enum: ['Food_Preparation', 'Delivery'],
        required: true
    },
    tasks: [
        {
            food: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Food',
                required: true
            },
            assignedDate: {
                type: Date,
                default: Date.now
            }
        }
    ]
});

// Hash password before saving to the database
pantryStaffSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next(); // Skip if password not modified
    this.password = await bcrypt.hash(this.password, 10); // Hash the password
    next();
});

// Compare passwords for login
pantryStaffSchema.methods.comparePassword = async function (inputPassword) {
    return bcrypt.compare(inputPassword, this.password);
};

const PantryStaff = mongoose.model('PantryStaff', pantryStaffSchema);

module.exports = PantryStaff;
