const express = require('express');
require('dotenv').config();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const foodRoute = require('./routes/foodRoute');
const patientsRoute = require('./routes/patientsRoute');
const mealTaskRoute = require('./routes/mealTaskRoute');
const pantryStaffRoute = require('./routes/pantryStaffRoute');
const userRoute = require('./routes/userRoute.js');
const cors = require('cors');

const MONGODB_URL = process.env.MONGODB_URL;

const app = express();
const port = process.env.PORT || 3000;
// Environment configuration
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config({ path: './.env.development' });
} else {
    require('dotenv').config({ path: './.env.production' });
}
// Middleware
app.use(bodyParser.json());
app.use(cors());
// MongoDB connection
mongoose.connect(MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected...'))
.catch(err => console.log(err));

// Routes
app.use('/api',foodRoute);
app.use('/api',pantryStaffRoute);
app.use('/api',patientsRoute);
app.use('/api',mealTaskRoute);
app.use('/api',userRoute);

// Start server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});