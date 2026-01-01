// import { useSelector } from 'react-redux'
// import { Navigate, Outlet } from 'react-router-dom'
// import { userSelector } from '../Store/ReduxSlice/userSlice'
import { Navigate, Outlet } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../Contexts/AuthContext";

// const UserProtected = () => {

//   const userData = useSelector(userSelector)
//   console.log('profile ',userData)
//   // const user=true
//   return userData.name? <Outlet/>:<Navigate to='/login'/>
// }

// export default UserProtected

const UserProtected = () => {
  const { user, loading } = useContext(AuthContext);

  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;

  // Redirect based on role
  if (user.role === 'SELLER') return <Navigate to="/seller/dashboard" replace />;
  if (user.role === 'ADMIN') return <Navigate to="/admin" replace />;

  return <Outlet />;
};

export default UserProtected;