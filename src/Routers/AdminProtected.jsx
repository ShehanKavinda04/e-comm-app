import { Navigate, Outlet } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../Contexts/AuthContext"; // Adjust path if needed

const AdminProtected = () => {
  const { user, loading } = useContext(AuthContext);

  // 1. Still checking token / loading user
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div>Loading...</div>
      </div>
    );
  }

  // 2. Not logged in → go to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // 3. Logged in but not ADMIN → redirect home (or show 404)
  if (user.role !== "ADMIN") {
    // Option A: Redirect to home
    return <Navigate to="/" replace />;

    // Option B: Show 404 page instead (uncomment if you prefer)
    // return <NoUrl />;
  }

  // 4. Everything good → render child routes (Admin dashboard, etc.)
  return <Outlet />;
};

export default AdminProtected;