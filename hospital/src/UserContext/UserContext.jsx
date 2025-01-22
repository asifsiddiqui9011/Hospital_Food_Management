import { createContext, useContext, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Example user object: { role: "manager" }
  const navigate = useNavigate();
  
  const url = 'http://localhost:3000'; // Backend URL


  

  // Load token and validate user on app initialization
  useEffect(() => {
    const token = localStorage.getItem('auth-token');
    if (token && user === null) {

        try {
          const decoded = jwtDecode(token); // Use the function as needed
          console.log(decoded);
          setUser({ role: decoded.role, token });
          if (decoded.role === 'manager') {
          navigate('/hospital-manager-dashboard');
          } else if (decoded.role === 'Food_Preparation') {
          navigate('/PantryStaff-dashboard');
          }else if (decoded.role === 'Delivery') {
            navigate('/delivery-dashboard');
            } else {
          navigate('/login');
          }
        } catch (error) {
          console.error('Error decoding token:', error);
        }

    }
  }, []);

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

  return (
    <UserContext.Provider value={{ user, login, logout ,url}}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
