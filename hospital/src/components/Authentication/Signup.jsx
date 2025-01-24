


import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from '../../context/UserContext';
import './Login.css';

const Signup = () => {
  const [signupData, setSignupData] = useState({
    staffName: "", // Used for Food_Preparation or Delivery
    email: "",
    password: "",
    role: "", // Dropdown for role selection (manager, Food_Preparation, or Delivery)
  });

  const { login,url } = useContext(UserContext);

  const [additionalFields, setAdditionalFields] = useState({}); // Dynamic fields based on role
 

  // Handle role change
  const handleRoleChange = (e) => {
    const role = e.target.value;
    setSignupData((prev) => ({ ...prev, role }));

    // Set the fields based on the selected role
    if (role === "manager") {
      setAdditionalFields({
        email: true,
        password: true,
      });
    } else if (role === "Food_Preparation" || role === "Delivery") {
      setAdditionalFields({
        staffName: true,
        email: true,
        password: true,
      });
    } else {
      setAdditionalFields({});
    }
  };

  // Handle input changes
  const changeHandler = (e) => {
    setSignupData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // Register function
  const register = async (event) => {
    event.preventDefault();
    try {
      let responseData;
      

      // Send the signup data to the server
      await fetch(`${url}/api/register`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(signupData),
      })
        .then((response) => response.json())
        .then((data) => (responseData = data));

        if (responseData.success) {
          localStorage.setItem('auth-token', responseData.token); 
          login(responseData.token); 
        
          // Navigate based on the role
          switch (`${responseData.role}`) {
            case 'manager':
              window.location.replace('/hospital-manager-dashboard');
              break;
            case 'Food_Preparation':
              window.location.replace('/PantryStaff-dashboard');
              break;
            case 'Delivery':
              window.location.replace('/delivery-dashboard');
              break;
            default:
              window.location.replace('/login'); 
              break;
          }
        }
    } catch (error) {
      console.log(error, "error");
      alert("An error occurred during signup.");
    }
  };

  return (
    <div className="login-container">
      <div className="login-form-container">
        <form onSubmit={register} className="login-form">
          <h2>Sign Up</h2>
          <hr />

          {/* Role Selection */}
          <span>
            <p>Role: </p>
            <select
              name="role"
              value={signupData.role}
              onChange={handleRoleChange}
              required
            >
              <option value="">Select Role</option>
              <option value="manager">Manager</option>
              <option value="Food_Preparation">Food Preparation</option>
              <option value="Delivery">Delivery</option>
            </select>
          </span>

          {/* Dynamic fields based on role */}
          {additionalFields.staffName && (
            <span>
              <p>Staff Name: </p>
              <input
                type="text"
                placeholder="Enter staff name"
                name="staffName"
                value={signupData.staffName}
                onChange={changeHandler}
                required
              />
            </span>
          )}

          {additionalFields.email && (
            <span>
              <p>Email: </p>
              <input
                type="email"
                placeholder="Enter email"
                name="email"
                value={signupData.email}
                onChange={changeHandler}
                required
              />
            </span>
          )}

          {additionalFields.password && (
            <span>
              <p>Password: </p>
              <input
                type="password"
                placeholder="Enter password"
                name="password"
                value={signupData.password}
                onChange={changeHandler}
                required
              />
            </span>
          )}

          <button type="submit" className="cancel-tkt-btn">
            Signup
          </button>
          <p>
            Already have an account? Click to{" "}
            <b>
              <Link to={"/login"}>Login</Link>
            </b>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Signup;
