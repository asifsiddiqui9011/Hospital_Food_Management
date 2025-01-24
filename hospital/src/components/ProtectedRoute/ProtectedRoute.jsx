import { useContext } from 'react';
import PropTypes from 'prop-types';
import { Navigate } from 'react-router-dom';
import {UserContext} from '../../context/UserContext';

const ProtectedRoute = ({ element, roles = [] }) => {
  const { user } = useContext(UserContext);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (roles.length > 0 && !roles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return element;
}

ProtectedRoute.propTypes = {
  element: PropTypes.element.isRequired,
  roles: PropTypes.arrayOf(PropTypes.string)
};

export default ProtectedRoute;