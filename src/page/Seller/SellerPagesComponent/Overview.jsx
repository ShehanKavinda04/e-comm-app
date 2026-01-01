import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';

import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSellerStats } from '../../../Store/ReduxSlice/sellerSlice';
import LocalMallIcon from '@mui/icons-material/LocalMall';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import AddIcon from '@mui/icons-material/Add';
import FeaturedVideoIcon from '@mui/icons-material/FeaturedVideo';
import TimelineIcon from '@mui/icons-material/Timeline';
import StoreIcon from '@mui/icons-material/Store';

const Overview = ({ onNavigate }) => {
  const dispatch = useDispatch();

  // Safe selector access
  const sellerState = useSelector((state) => state.seller);

  useEffect(() => {
    // Initial fetch
    dispatch(fetchSellerStats());

    // Poll every 3 seconds for real-time updates
    const intervalId = setInterval(() => {
      dispatch(fetchSellerStats());
    }, 3000);

    return () => clearInterval(intervalId);
  }, [dispatch]);

  if (!sellerState) {
    return <div className="p-4 text-red-500">Error: Seller data not found. Please refresh the page.</div>;
  }

  const { stats, isLoading } = sellerState;

  // Format currency
  const formatCurrency = (amount) => {
    return `Rs. ${amount}`;
  };

  return (
    <div className="w-full p-6 bg-white min-h-screen font-sans">
      {/* Top Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard
          title="Pending Approvals"
          value={isLoading ? "..." : stats.pendingApprovals}
          valueColor="text-red-700"
        />
        <StatsCard
          title="Total Products"
          value={isLoading ? "..." : stats.totalProducts.toLocaleString()}
          valueColor="text-black"
        />
        <StatsCard
          title="Out of Stock"
          value={isLoading ? "..." : stats.outOfStock}
          valueColor="text-red-700"
        />
        <StatsCard
          title="Flagged Products"
          value={isLoading ? "..." : stats.flaggedProducts}
          valueColor="text-amber-500"
        />
      </div>



      {/* Main Content Sections */}
      <div className="flex flex-col lg:flex-row gap-6">

        {/* Pending Approvals */}
        <div className="rounded-xl p-6 w-full lg:w-1/2 bg-white flex flex-col shadow-sm border border-gray-100 relative">
          <div className="absolute top-6 right-6 w-8 h-8 bg-[#cc5e4d] rounded-full flex items-center justify-center text-white font-bold text-lg">!</div>

          <div className="flex items-center gap-2 mb-6">
            <h2 className="text-xl font-bold text-gray-800">Pending Approvals</h2>
            {stats.pendingApprovalsList && stats.pendingApprovalsList.length > 0 && (
              <span className="bg-[#cc5e4d] text-white text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full">
                {stats.pendingApprovalsList.length}
              </span>
            )}
          </div>

          <div className="flex flex-col divide-y divide-gray-100">
            {stats.pendingApprovalsList && stats.pendingApprovalsList.length > 0 ? (
              stats.pendingApprovalsList.map((item) => (
                <div key={item.id} className="flex justify-between items-center py-4">
                  <div>
                    <h4 className="font-bold text-gray-900 text-sm">{item.title}</h4>
                    <p className="text-xs text-gray-500 mt-0.5">{item.subtitle}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button className="text-black hover:text-gray-600">
                      {/* Eye Icon */}
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </button>
                    <button className="bg-green-100 text-green-500 rounded-full p-1 hover:bg-green-200">
                      {/* Check Icon */}
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                    </button>
                    <button className="bg-red-100 text-red-500 rounded-full p-1 hover:bg-red-200">
                      {/* X Icon */}
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="py-4 text-gray-500 text-sm">No pending items.</p>
            )}
          </div>
        </div>

        {/* Recent Orders */}
        <div className="w-full lg:w-1/2 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-black">Recent Orders</h2>
            <span
              onClick={() => onNavigate && onNavigate('Orders')}
              className="text-black font-bold cursor-pointer hover:underline text-sm"
            >
              View All
            </span>
          </div>

          <div className="flex flex-col gap-4">
            {stats.recentOrders && stats.recentOrders.length > 0 ? (
              stats.recentOrders.map((order, index) => {
                let statusColor = "";
                let statusBg = "";
                switch (order.status) {
                  case "Shipped":
                    statusColor = "text-blue-600";
                    statusBg = "bg-blue-50";
                    break;
                  case "Delivered":
                    statusColor = "text-green-600";
                    statusBg = "bg-green-50";
                    break;
                  case "Processing":
                    statusColor = "text-orange-600";
                    statusBg = "bg-orange-50";
                    break;
                  case "Canceled":
                    statusColor = "text-red-600";
                    statusBg = "bg-red-50";
                    break;
                  default:
                    statusColor = "text-gray-600";
                    statusBg = "bg-gray-50";
                }
                return (
                  <OrderCard
                    key={index}
                    id={order.id}
                    name={order.customerName || order.name} /* Fallback to name if customerName missing in some mocks */
                    price={formatCurrency(order.amount || parseFloat(order.price.replace(/[^0-9.]/g, '')))} /* Handle raw number or string price */
                    status={order.status}
                    statusColor={statusColor}
                    statusBg={statusBg}
                  />
                )
              })
            ) : (
              !isLoading && <p>No recent orders</p>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

// Sub-components

const StatsCard = ({ title, value, valueColor = "text-black" }) => (
  <div className="bg-white border text-black p-5 rounded-lg flex flex-col justify-center shadow-sm h-32">
    <p className="text-sm font-medium mb-2">{title}</p>
    <p className={`text-3xl font-bold ${valueColor}`}>{value}</p>
  </div>
);

const QuickActionButton = ({ icon, text, onClick }) => (
  <button onClick={onClick} className="flex items-center justify-center w-full border border-orange-300 rounded-lg py-4 hover:bg-orange-50 transition-colors group">
    <span className="mr-3 text-black group-hover:text-orange-700 font-medium flex items-center">
      {icon}
    </span>
    <span className="text-black font-normal text-base">{text}</span>
  </button>
);

const OrderCard = ({ id, name, price, status, statusColor, statusBg }) => (
  <div className="border border-gray-200 bg-white rounded-lg p-4 flex justify-between items-center shadow-sm hover:shadow-md transition-shadow">
    <div className="flex flex-col">
      <p className="font-bold text-gray-800 text-sm">{id}</p>
      <p className="text-xs text-gray-500 mt-1">{name}</p>
    </div>
    <div className="flex flex-col items-end">
      <p className="font-bold text-black text-sm mb-1">{price}</p>
      <span className={`text-[10px] px-3 py-1 rounded-full font-medium ${statusColor} ${statusBg}`}>
        {status}
      </span>
    </div>
  </div>
);

export default Overview;