# Hospital Food Management System

## Overview
The Hospital Food Management System is a full-stack web application designed to efficiently manage food preparation and delivery for hospital patients. It enables seamless coordination among managers, food preparation staff, and delivery staff to ensure timely and appropriate meals are served to patients based on their dietary requirements.

## Features

### Role-Based Access
**Manager:**
- Manage food inventory.
- Assign meal preparation and delivery tasks.
- Monitor task statuses.

**Food Preparation Staff:**
- View and update meal preparation tasks.
- Mark meals as prepared.

**Delivery Staff:**
- View and update delivery tasks.
- Mark meals as delivered.

### Food Management
- Add, edit, and delete food items.
- Track food inventory with details like food name, quantity, and expiration date.

### Patient Management
- Add and manage patient details (e.g., dietary restrictions, allergies, room/bed details).
- Assign specific food items to patients.

### Meal Task Management
- Assign food preparation and delivery tasks to staff.
- Track preparation and delivery statuses (Pending, In Progress, Prepared, Out for Delivery, Delivered, Failed).

### Authentication
- Role-based registration and login.
- JWT-based secure authentication for API access.

### Error Handling
- Detailed error messages for unauthorized access, missing data, and invalid operations.

## Technologies Used

### Frontend
- React.js: For building dynamic and responsive user interfaces.
- CSS: For styling components.

### Backend
- Node.js: For building the server-side application.
- Express.js: For handling HTTP requests and routing.
- MongoDB: For storing data (e.g., users, food items, patients).
- Mongoose: For database modeling and validation.

### Authentication
- JWT (JSON Web Token): For secure, role-based user authentication.
- bcrypt.js: For password hashing and validation.

## Installation and Setup

### Prerequisites
- Install Node.js (v14 or later).
- Install MongoDB and ensure it is running.

### Backend Setup
1. Clone the repository:
    ```bash
    git clone https://github.com/yourusername/hospital-food-management.git
    cd hospital-food-management/server
    ```

2. Install dependencies:
    ```bash
    npm install
    ```

3. Create a [.env](http://_vscodecontentref_/0) file with the following content:
    ```env
    MONGO_URI=mongodb://localhost:27017/hospital-food-management
    JWT_SECRET=your-secret-key
    PORT=3000
    ```

4. Start the server:
    ```bash
    npm start
    ```

### Frontend Setup
1. Navigate to the client directory:
    ```bash
    cd ../client
    ```

2. Install dependencies:
    ```bash
    npm install
    ```

3. Start the React development server:
    ```bash
    npm start
    ```

## API Endpoints

### Authentication
- **Register (POST):** `/api/auth/register`
  - Register a manager, food preparation staff, or delivery staff.
- **Login (POST):** `/api/auth/login`
  - Authenticate a user and generate a JWT.

### Food Management
- **Add Food (POST):** `/api/food`
  - Add a new food item.
- **Get Food (GET):** `/api/food`
  - Get a list of all food items.
- **Update Food (PUT):** `/api/food/:id`
  - Update food details.
- **Delete Food (DELETE):** `/api/food/:id`
  - Delete a food item (with cascading effects).

### Patient Management
- **Add Patient (POST):** `/api/patients`
  - Add a new patient with dietary information.
- **Get Patients (GET):** `/api/patients`
  - Retrieve a list of all patients.
- **Update Patient (PUT):** `/api/patients/:id`
  - Update patient details.
- **Delete Patient (DELETE):** `/api/patients/:id`
  - Delete a patient.

### Meal Task Management
- **Assign Task (POST):** `/api/mealtasks`
  - Assign meal preparation and delivery tasks.
- **Get Tasks (GET):** `/api/mealtasks`
  - Retrieve all meal tasks.
- **Update Task (PUT):** `/api/mealtasks/:id`
  - Update task details (e.g., preparation or delivery status).

## Database Models

### User Model
Fields:
- `email` (String, unique, required)
- `password` (String, required)
- `role` (String: Manager, Food Preparation, Delivery, required)

### Food Model
Fields:
- `name` (String, required)
- `quantity` (Number, required)
- `expirationDate` (Date, required)

### Patient Model
Fields:
- `patientName` (String, required)
- `age` (Number, required)
- `gender` (String, required)
- `allergies` (Array of Strings)
- `diseases` (Array of Strings)
- `roomNumber` (String, required)
- `foodIds` (Array of ObjectId references to Food)

### Meal Task Model
Fields:
- `foodId` (ObjectId reference to Food, required)
- `quantity` (Number, required)
- `preparationStatus` (String: Pending, In Progress, Prepared)
- `deliveryStatuses` (Array of delivery status subdocuments)

## Usage

### Register a User:
- Select a role (Manager, Food Preparation, or Delivery) during registration.
- Use the appropriate dashboard after login.

### Manage Food:
- Add, edit, and delete food items from the manager dashboard.

### Assign Tasks:
- Managers can assign preparation and delivery tasks to staff.
- Staff can update task statuses in real-time.