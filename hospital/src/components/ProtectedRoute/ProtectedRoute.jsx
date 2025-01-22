import { Navigate } from 'react-router-dom';
import { useUser } from '../../userContext/userContext';

const ProtectedRoute = ({ element, roles = [] }) => {
  const { user } = useUser();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (roles.length > 0 && !roles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return element;
};

export default ProtectedRoute;