import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../Contexts/AuthContext";
import { useState } from "react";
import IconButton from "@mui/material/IconButton";
import BusinessCenterIcon from "@mui/icons-material/BusinessCenter";
import Overview from "./AdminSetting/Overview";
import Order from "./AdminSetting/order/Order";
import UserManagement from "./AdminSetting/userManagement/UserManagement";
import ProductManagement from "./AdminSetting/ProductManagement";
import StoreIcon from "@mui/icons-material/Store";
import PersonIcon from "@mui/icons-material/Person";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";

const labelIcon = [
  {
    Icon: BusinessCenterIcon,
    title: "Overview",
    name: "Overview",
  },
  {
    Icon: ShoppingBagIcon,
    title: "Orders",
    name: "Orders",
  },
  {
    Icon: PersonIcon,
    title: "User Management",
    name: "User_Management",
  },
  {
    Icon: StoreIcon,
    title: "Product Management",
    name: "Product_Management",
  },
];

const AdminDashboard = () => {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [whoIsClick, setWhoIsClick] = useState({
    Overview: true,
    Orders: false,
    User_Management: false,
    Product_Management: false,
  });

  return (
    <div className="pt-[110px] w-full min-h-screen bg-gray-300 pb-10">
      <div className="flex flex-col md:flex-row md:items-center gap-5 justify-between mb-5">
        <div>
          <p className="text-5xl text-black font-normal mb-2 sm:ml-5 md:ml-14">
            Hello Mr. Admin
          </p>
          <p className="text-gray-700 font-medium sm:ml-5 md:ml-14">
            Manage your platform and monitor performance
          </p>
        </div>
        <div className="flex md:flex-row sm:flex-col md:gap-15 sm:gap-4 sm:items-center ">
          <button
            onClick={() => navigate('/')}
            className="bg-red-600 text-white font-bold text-xs sm:text-sm py-3 md:mr-25 sm:py-3 px-2 w-[250px] sm:px-8 rounded-md shadow hover:bg-red-700 transition"
          >
            Continue Shopping
          </button>
        </div>
      </div>
      <div className="flex items-center md:px-25 gap-10 px-5 mb-5 justify-between">
        <div className="grid grid-cols-3 md:grid-cols-2 lg:grid-cols-6 items-center w-full">
          {labelIcon.map(({ Icon, title, name }, index) => {
            return (
              <ProfileTab
                key={index}
                clickFun={{ whoIsClick, setWhoIsClick }}
                Icon={Icon}
                name={name}
                title={title}
              />
            );
          })}
        </div>
      </div>
      <div className="w-full bg-black h-[1px] " />

      {/* Conditionally render Overview based on state */}
      {whoIsClick.Overview && <Overview />}
      {whoIsClick.Orders && <Order />}
      {whoIsClick.User_Management && <UserManagement />}
      {whoIsClick.Product_Management && <ProductManagement />}
    </div>
  );
};

export default AdminDashboard;
const ProfileTab = ({ title, name, clickFun, Icon }) => {
  const clickHandle = () => {
    const obj = {
      Overview: true,
      Orders: false,
      User_Management: false,
      Product_Management: false,
    };
    switch (name) {
      case "Product_Management":
        (obj.Product_Management = true), (obj.Overview = false);
        break;
      case "Orders":
        (obj.Orders = true), (obj.Overview = false);
        break;
      case "User_Management":
        (obj.User_Management = true), (obj.Overview = false);
        break;
      default:
        obj.Overview = true;
        break;
    }

    clickFun.setWhoIsClick(obj);
  };

  const active = clickFun.whoIsClick[name];

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
        ${active
            ? "text-red-600 border-b-2 border-red-600"
            : "text-black border-b-2 border-transparent"
          }`}
      >
        {/* icon container */}
        <div
          className={`border p-1 rounded-md transition-colors duration-200 ${active ? "border-red-500" : "border-gray-500"
            }`}
        >
          {Icon && <Icon className="text-[20px] sm:text-[22px]" />}
        </div>

        {/* title */}
        <p
          className={`font-normal ml-1 sm:ml-2 text-sm sm:text-base md:text-lg transition-colors duration-200 ${active ? "text-red-600" : "text-black"
            }`}
        >
          {title}
        </p>
      </div>
    </IconButton>
  );
};
