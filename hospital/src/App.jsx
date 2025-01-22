
// import { BrowserRouter, BrowserRouter as  Route, Routes } from 'react-router-dom';
// import { UserProvider } from './userContext/userContext';
// import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
// import Navbar from './components/Navbar/Navbar';
// import Login from './components/Authentication/Login';
// import Signup from './components/Authentication/Signup';
// import AddPatient from './components/Patient/AddPatient';
// import AddFood from './components/Food/AddFood';
// import AddMealTask from './components/MealTask/AddMealTask';
// import DeliveryStatusUpdater from './components/Delivery/DeliveryStatusUpdater';
// import AddFoodToPatient from './components/Patient/AddFoodToPatient';
// import MealTaskForPreparationUpdate from './components/MealTask/MealTaskForPreparationUpdate';
// import DeliveryStatusTracker from './components/Delivery/DeliveryStatusTracker';
// import HospitalManagerDeliveryStatus from './components/Delivery/HospitalManagerDeliveryStatus';

// function App() {
//   return (
//     <BrowserRouter>
//     <UserProvider>
   
//       <Navbar />
//       <Routes>
//         <Route path="/login" element={<Login />} />
//         <Route path="/signup" element={<Signup />} />
//         <Route path="/food" element={<ProtectedRoute element={<AddFood />} roles={['manager']} />} />
//         <Route path="/foodtopatient" element={<ProtectedRoute element={<AddFoodToPatient />} roles={['manager']} />} />
//         <Route path="/patient" element={<ProtectedRoute element={<AddPatient />} roles={['manager']} />} />
//         <Route path="/hospital-manager-dashboard" element={<ProtectedRoute element={<AddMealTask />} roles={['manager']} />} />
//         <Route path="/delivery-dashboard" element={<ProtectedRoute element={<DeliveryStatusUpdater />} roles={['Delivery']} />} />
//         <Route path="/meal/preparationstaff" element={<ProtectedRoute element={<MealTaskForPreparationUpdate/>} roles={['Food_Preparation','manager']} />} />
//         <Route path="/delivery/statustrack" element={<ProtectedRoute element={<DeliveryStatusTracker />} roles={['Delivery','manager']} />} />
//         <Route path="/hospital/delivery/statustrack" element={<ProtectedRoute element={<HospitalManagerDeliveryStatus />} roles={['manager']} />} />
//         <Route path="/unauthorized" element={<h1>Unauthorized Access</h1>} />
//       </Routes>
      
//     </UserProvider>
//     </BrowserRouter>
//   );
// }

// export default App;

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { UserProvider } from './userContext/userContext';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import Navbar from './components/Navbar/Navbar';
import Login from './components/Authentication/Login';
import Signup from './components/Authentication/Signup';
import AddPatient from './components/Patient/AddPatient';
import AddFood from './components/Food/AddFood';
import AddMealTask from './components/MealTask/AddMealTask';
import DeliveryStatusUpdater from './components/Delivery/DeliveryStatusUpdater';
import AddFoodToPatient from './components/Patient/AddFoodToPatient';
import MealTaskForPreparationUpdate from './components/MealTask/MealTaskForPreparationUpdate';
import DeliveryStatusTracker from './components/Delivery/DeliveryStatusTracker';
import HospitalManagerDeliveryStatus from './components/Delivery/HospitalManagerDeliveryStatus';

function App() {
  return (
    <BrowserRouter>
      <UserProvider>
        <Navbar />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/food" element={<ProtectedRoute element={<AddFood />} roles={['manager']} />} />
          <Route path="/foodtopatient" element={<ProtectedRoute element={<AddFoodToPatient />} roles={['manager']} />} />
          <Route path="/patient" element={<ProtectedRoute element={<AddPatient />} roles={['manager']} />} />
          <Route path="/hospital-manager-dashboard" element={<ProtectedRoute element={<AddMealTask />} roles={['manager']} />} />
          <Route path="/delivery-dashboard" element={<ProtectedRoute element={<DeliveryStatusUpdater />} roles={['Delivery']} />} />
          <Route path="/meal/preparationstaff" element={<ProtectedRoute element={<MealTaskForPreparationUpdate />} roles={['Food_Preparation', 'manager']} />} />
          <Route path="/delivery/statustrack" element={<ProtectedRoute element={<DeliveryStatusTracker />} roles={['Delivery', 'manager']} />} />
          <Route path="/hospital/delivery/statustrack" element={<ProtectedRoute element={<HospitalManagerDeliveryStatus />} roles={['manager']} />} />
          <Route path="/unauthorized" element={<h1>Unauthorized Access</h1>} />
        </Routes>
      </UserProvider>
    </BrowserRouter>
  );
}

export default App;
