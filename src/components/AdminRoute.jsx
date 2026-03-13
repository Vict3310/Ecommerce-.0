import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AdminRoute = ({ children }) => {
  const { user, isAdmin, loading } = useAuth();

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!user || !isAdmin) {
    // Redirect to home if not logged in or not an admin
    return <Navigate to="/" replace />;
  }

  return children;
};

export default AdminRoute;
