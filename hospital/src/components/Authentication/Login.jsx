
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useUser } from '../../userContext/userContext';
import './Login.css';

const Login = () => {
  const [userData, setUserData] = useState({
    role: "",
    email: "",
    password: "",
  });

  const { login,url } = useUser();
  

  const changeHandler = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
  };

  // Login function
  const loginn = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch(`${url}/api/login`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData), // Send role, email, and password
      });

      // Check if the response is OK
      if (!response.ok) {
        console.log(response);
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      // Check if the response has content
      const responseData = await response.json();
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
      console.log(error);
      alert(error.message || "Login failed");
    }
  };

  return (
    <div className="login-container">
      <div className="login-form-container">
        <form onSubmit={loginn} className="login-form">
          <h2>
            Login
            <hr />
          </h2>

          <span>
            <p>Role: </p>
            <select
              name="role"
              value={userData.role}
              onChange={changeHandler}
              required
            >
              <option value="">Select Role</option>
              <option value="manager">Manager</option>
              <option value="Food_Preparation">Food Preparation</option>
              <option value="Delivery">Delivery</option>
            </select>
          </span>

          <span>
            <p>Email: </p>
            <input
              type="email"
              placeholder="Enter email"
              name="email"
              value={userData.email}
              onChange={changeHandler}
              required
              style={{ height: "35px" }}
            />
          </span>

          <span>
            <p>Password: </p>
            <input
              type="password"
              placeholder="Enter password"
              name="password"
              value={userData.password}
              onChange={changeHandler}
              required
              style={{ height: "35px" }}
            />
          </span>

          {/* <span>
            <p>
              <Link to="/forgot-password">Forgot Password?</Link>
            </p>
            <p>
              <Link to="/signup">Sign Up</Link>
            </p>
          </span> */}

          <button type="submit" className="cancel-tkt-btn">
            Login
          </button>
          <p>
            Don’t have an account? Click to{" "}
            <b>
              <Link to={"/signup"}>Sign Up</Link>
            </b>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
