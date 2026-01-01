import React, { useContext } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import IconButton from "@mui/material/IconButton";
import BusinessCenterIcon from "@mui/icons-material/BusinessCenter";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { AuthContext } from "../../Contexts/AuthContext";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import PersonIcon from "@mui/icons-material/Person";

const labelIcon = [
  {
    Icon: BusinessCenterIcon,
    title: "Overview",
    path: "", // Index route
  },
  {
    Icon: BusinessCenterIcon,
    title: "My Orders",
    path: "orders",
  },
  {
    Icon: FavoriteIcon,
    title: "Wishlist",
    path: "wishlist",
  },
  {
    Icon: PersonIcon,
    title: "Profile & Settings",
    path: "settings",
  },
  {
    Icon: LocationOnIcon,
    title: "Address",
    path: "address",
  },
  {
    Icon: MonetizationOnIcon,
    title: "Payment Methods",
    path: "payment-methods",
  },
];

import LogoutModal from '../../component/LogoutModal';

const User = () => {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [showLogoutConfirm, setShowLogoutConfirm] = React.useState(false);

  const confirmLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="pt-[110px] w-full ms:h-full md:h-screen md:overflow-scroll sm:overflow-hidden bg-gray-300">
      <div className="flex flex-col md:flex-row md:items-center gap-5 justify-between mb-5">
        {/* ... existing header content ... */}
        <div>
          <p className="text-5xl text-black font-normal mb-2 sm:ml-5 md:ml-14">
            User Account
          </p>
          <p className="text-gray-700 font-medium sm:ml-5 md:ml-14">
            Manage your account orders, wishlist, and account settings
          </p>
        </div>
        <div className="flex md:flex-row sm:flex-col md:gap-15 sm:gap-4 sm:items-center">
          <button className="bg-orange-600 text-white font-medium sm:w-[250px] text-xs sm:text-sm py-2 w-[200px] sm:py-2 px-8 rounded-full shadow hover:bg-orange-700 transition">
            Gold Member
          </button>
          <button
            onClick={() => navigate('/seller')}
            className="bg-red-600 text-white font-bold text-xs sm:text-sm py-3 md:mr-25 sm:py-3 px-2 w-[250px] sm:px-8 rounded-md shadow hover:bg-red-700 transition"
          >
            + Become a Seller
          </button>
        </div>
      </div>
      <div className="flex items-center md:px-25 gap-10 px-5 mb-5 justify-between">
        <div className="grid grid-cols-3 md:grid-cols-2 lg:grid-cols-6 items-center w-full">
          {labelIcon.map(({ Icon, title, path }, index) => {
            return (
              <ProfileTab
                key={index}
                Icon={Icon}
                title={title}
                path={path}
                navigate={navigate}
                currentPath={location.pathname}
              />
            );
          })}
        </div>
      </div>
      <div className="w-full bg-black h-[1px]" />

      {/* Nested Route Content */}
      <Outlet />



      <LogoutModal
        isOpen={showLogoutConfirm}
        onClose={() => setShowLogoutConfirm(false)}
        onConfirm={confirmLogout}
      />
    </div>
  );
};
export default User;

const ProfileTab = ({ title, path, Icon, navigate, currentPath }) => {
  const clickHandle = () => {
    navigate(path);
  };

  // Determine if active.
  const isActive =
    path === ""
      ? currentPath.endsWith("/profile") || currentPath.endsWith("/profile/")
      : currentPath.includes(path);

  return (
    <IconButton
      onClick={clickHandle}
      sx={{
        fontSize: "17px",
        margin: "1px",
        marginLeft: "5px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        className={`cursor-pointer flex flex-col items-center sm:flex-row sm:items-center transition-all duration-200 
        ${isActive
            ? "text-red-600 border-b-2 border-red-600"
            : "text-black border-b-2 border-transparent"
          }`}
      >
        {/* icon container */}
        <div
          className={`border p-1 rounded-md transition-colors duration-200 ${isActive ? "border-red-500" : "border-gray-500"
            }`}
        >
          {Icon && <Icon className="text-[20px] sm:text-[22px]" />}
        </div>

        {/* title */}
        <p
          className={`font-normal ml-1 sm:ml-2 text-sm sm:text-base md:text-lg transition-colors duration-200 ${isActive ? "text-red-600" : "text-black"
            }`}
        >
          {title}
        </p>
      </div>
    </IconButton>
  );
};
