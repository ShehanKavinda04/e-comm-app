import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../../Contexts/AuthContext';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user } = useContext(AuthContext);

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Or a 403 page
    return <Navigate to="/" />; 
  }

  return children;
};

export default ProtectedRoute;