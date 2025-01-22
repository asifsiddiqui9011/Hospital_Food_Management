import React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import { Link } from 'react-router-dom';
import { useUser } from '../../userContext/userContext';
import './Navbar.css'; // Import custom CSS

export default function ButtonAppBar() {
  const [menuOpen, setMenuOpen] = React.useState(false);
  const { user, logout } = useUser(); // Access user data from context

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  // Links configuration based on roles
  const navLinks = [
    { to: '/food', label: 'Food', roles: ['manager'] },
    { to: '/patient', label: 'Patient', roles: ['manager'] },
    { to: '/foodtopatient', label: 'Assign Food To Patient', roles: ['manager'] },
    { to: '/hospital-manager-dashboard', label: 'Add Meal Task', roles: ['manager'] },
    { to: '/delivery-dashboard', label: 'Delivery Dashboard', roles: ['Delivery'] },
    { to: '/meal/preparationstaff', label: 'Update Meal Preparation Status', roles: ['Food_Preparation','manager'] },
    { to: '/delivery/statustrack', label: 'Mark Food Out For Devilery', roles: ['Delivery','manager'] },
    { to: '/hospital/delivery/statustrack', label: 'Track Delivery Status', roles: ['manager'] },
  ];

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
            onClick={toggleMenu}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Hospital Management System
          </Typography>
          {localStorage.getItem('auth-token') ? 
            <Button color="inherit" onClick={logout}>
              Logout
            </Button>
           : 
            <Link to={'/login'}>
              <Button color="inherit">Login</Button>
            </Link>
          }
        </Toolbar>
      </AppBar>

      {/* Sliding menu */}
      <div className={`sliding-menu ${menuOpen ? 'open' : ''}`}>
        <IconButton
          size="small"
          color="inherit"
          className="close-button"
          onClick={toggleMenu}
        >
          <CloseIcon />
        </IconButton>
        <ul>
          {user ? (
            navLinks
              .filter((link) => link.roles.includes(user.role)) // Filter links based on user's role
              .map((link) => (
                <Link key={link.to} to={link.to}>
                  <li>{link.label}</li>
                </Link>
              ))
          ) : (
            <Link to={'/login'}>
              <li>Login</li>
            </Link>
          )}
        </ul>
      </div>
    </Box>
  );
}
