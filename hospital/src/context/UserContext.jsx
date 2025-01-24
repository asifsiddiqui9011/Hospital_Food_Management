
import { createContext, useState } from 'react';
import {jwtDecode} from 'jwt-decode'; // Ensure the import statement is correct
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

export const UserContext = createContext(null);

const  UserContextProvider = (props) => {


  const [user, setUser] = useState(null); // Example user object: { role: "manager" }
  const navigate = useNavigate();
  
  const url = 'https://hospital-food-management-r6so.onrender.com'; // Backend URL
  // const url = 'http://localhost:3000'; // Backend UR

  // Load token and validate user on app initialization
  useEffect(() => {
    const token = localStorage.getItem('auth-token');
    if (token && user === null) {
      try {
        const decoded = jwtDecode(token); // Use the function as needed
        setUser({ role: decoded.role, token });
        if (decoded.role === 'manager') {
          navigate('/hospital-manager-dashboard');
        } else if (decoded.role === 'Food_Preparation') {
          navigate('/meal/preparationstaff');
        } else if (decoded.role === 'Delivery') {
          navigate('/delivery-dashboard');
        } else {
          navigate('/login');
        }
      } catch (error) {
        console.error('Error decoding token:', error);
        navigate('/login'); // Fallback to login if token decoding fails
      }
    }
  }, [navigate, user]);

  const login = (token) => {
    try {
      const decodedToken = jwtDecode(token);
      setUser({ role: decodedToken.role, token });
      localStorage.setItem('auth-token', token);
    } catch (error) {
      console.error('Invalid token', error);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('auth-token');
  };

  const contextValue = { user, login, logout, url };
  return (
    <UserContext.Provider value={contextValue}>
      {props.children}
    </UserContext.Provider>
  );


};

export default UserContextProvider;
