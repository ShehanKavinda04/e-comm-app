import { useState } from "react";
import IconButton from "@mui/material/IconButton";
import BusinessCenterIcon from "@mui/icons-material/BusinessCenter";
import StoreIcon from "@mui/icons-material/Store";
import TimelineIcon from "@mui/icons-material/Timeline";
import FeaturedVideoIcon from "@mui/icons-material/FeaturedVideo";
import Overview from "./SellerPagesComponent/Overview";
import MyProduct from "./SellerPagesComponent/myProduct/MyProduct";
import Orders from "./SellerPagesComponent/Orders";
import Analytics from "./SellerPagesComponent/AnalyticsComponents/Analytics";
import Advertisement from "./SellerPagesComponent/Advertisement";
import StoreSetting from "./SellerPagesComponent/StoreSetting";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import { useContext } from "react";
import { AuthContext } from "../../Contexts/AuthContext";

const labelIcon = [
  {
    Icon: BusinessCenterIcon,
    title: "Overview",
    name: "Overview",
  },
  {
    Icon: ShoppingBagIcon,
    title: "My Product",
    name: "My_Product",
  },
  {
    Icon: BusinessCenterIcon,
    title: "Orders",
    name: "Orders",
  },
  {
    Icon: TimelineIcon,
    title: "Analytics",
    name: "Analytics",
  },
  {
    Icon: FeaturedVideoIcon,
    title: "Advertisement",
    name: "Advertisement",
  },
  {
    Icon: StoreIcon,
    title: "Store Setting",
    name: "Store_Setting",
  },
];

const SellerProfile = () => {
  const { logout } = useContext(AuthContext);

  const [whoIsClick, setWhoIsClick] = useState({
    Overview: true,
    My_Product: false,
    Orders: false,
    Analytics: false,
    Advertisement: false,
    Store_Setting: false,
  });

  const [triggerAddProduct, setTriggerAddProduct] = useState(false);

  const switchTab = (tabName) => {
    setWhoIsClick({
      Overview: false,
      My_Product: false,
      Orders: false,
      Analytics: false,
      Advertisement: false,
      Store_Setting: false,
      [tabName]: true
    });
  };

  return (
    <div className="pt-[110px] w-full ms:h-full md:h-screen md:overflow-scroll sm:overflow-hidden bg-gray-300">
      <div className="flex flex-col md:flex-row md:items-center gap-5 justify-between mb-5">
        <div>
          <p className="text-5xl text-black font-normal mb-2 sm:ml-5 md:ml-14">
            Hello Mr. Seller
          </p>
          <p className="text-gray-700 font-medium sm:ml-5 md:ml-14">
            Manage your product and track your seller
          </p>
        </div>
        <div className="flex md:flex-row sm:flex-col md:gap-15 sm:gap-4 sm:items-center">
          <button
            onClick={() => {
              switchTab("My_Product");
              setTriggerAddProduct(true);
            }}
            className="bg-red-600 text-white font-bold text-xs sm:text-sm py-3 md:mr-25 sm:py-3 px-2 w-[250px] sm:px-8 rounded-md shadow hover:bg-red-700 transition cursor-pointer"
          >
            + Add Product
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
      <div className="w-full bg-black h-[1px]" />


      {/* Conditionally render Overview based on state */}
      {whoIsClick.Overview && <Overview onNavigate={switchTab} />}
      {whoIsClick.My_Product && <MyProduct triggerAddProduct={triggerAddProduct} onAddProductHandled={() => setTriggerAddProduct(false)} />}
      {whoIsClick.Orders && <Orders />}
      {whoIsClick.Analytics && <Analytics />}
      {whoIsClick.Advertisement && <Advertisement />}
      {whoIsClick.Store_Setting && <StoreSetting />}


    </div>
  );
};

export default SellerProfile;

const ProfileTab = ({ title, name, clickFun, Icon }) => {
  const clickHandle = () => {
    const obj = {
      Overview: true,
      My_Product: false,
      Orders: false,
      Analytics: false,
      Advertisement: false,
      Store_Setting: false,
    };
    switch (name) {
      case "My_Product":
        (obj.My_Product = true), (obj.Overview = false);
        break;
      case "Orders":
        (obj.Orders = true), (obj.Overview = false);
        break;
      case "Analytics":
        (obj.Analytics = true), (obj.Overview = false);
        break;
      case "Overview":
        obj.Overview = true;
        break;
      case "Advertisement":
        (obj.Advertisement = true), (obj.Overview = false);
        break;
      case "Store_Setting":
        (obj.Store_Setting = true), (obj.Overview = false);
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
