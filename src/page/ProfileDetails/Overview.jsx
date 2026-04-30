import React from 'react'
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import PaymentsIcon from '@mui/icons-material/Payments';
import FavoriteIcon from '@mui/icons-material/Favorite';
import PersonIcon from '@mui/icons-material/Person';
import WebIcon from '@mui/icons-material/Web';
import AddIcon from '@mui/icons-material/Add';

import { useNavigate } from 'react-router-dom';
import { getUserOverview } from '../../Services/userService';
import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../Contexts/AuthContext';

const isRealToken = () => {
    const token = localStorage.getItem('token');
    return !!token; // Trust the token existence; backend will validate
};

const Overview = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState({
    totalOrders: 0,
    wishlistItems: 0,
    activeOrders: 0,
    loyaltyPoints: 0
  });

  useEffect(() => {
    let intervalId;

    const fetchData = async () => {
      if (user && isRealToken()) {
        try {
          const data = await getUserOverview();
          setStats({
            totalOrders: data.totalOrders || 0,
            wishlistItems: data.wishlistItems || 0,
            activeOrders: data.activeOrders || 0,
            loyaltyPoints: data.loyaltyPoints || 0
          });
          setOrders(data.recentOrders || []);
        } catch (error) {
          console.error("Failed to fetch user stats", error);
        }
      }
    };

    fetchData(); // Initial fetch

    // Poll every 5 seconds for real-time updates
    intervalId = setInterval(fetchData, 5000);

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [user]);

  return (
    <div>
      <div className='flex flex-wrap justify-center md:px-25 sm:justify-between gap-4 mb-8 mt-5 px-10'>
        <div className='flex justify-between sm:justify-around items-center bg-orange-600 text-white w-full md:w-[320px] sm:w-[170px] px-4 py-3 rounded-lg'>
          <div className='flex flex-col text-left'>
            <p className='text-[14px] font-normal'>Total Orders</p>
            <p className='font-bold text-lg'>{stats.totalOrders}</p>
          </div>
          <BusinessCenterIcon />

        </div>
        <div className='flex justify-between sm:justify-around items-center bg-orange-600 text-white  w-full md:w-[320px] sm:w-[185px] px-4 py-3 rounded-lg'>
          <div className='flex flex-col text-left'>
            <p className='text-[14px] font-normal'>Wishlist Items</p>
            <p className='font-bold'>{stats.wishlistItems}</p>
          </div>
          <FavoriteIcon />

        </div>
        <div className='flex justify-between sm:justify-around items-center bg-orange-600 text-white w-full md:w-[320px] sm:w-[185px] px-4 py-3 rounded-lg'>
          <div className='flex flex-col'>
            <p className='text-[14px] font-normal'>Active Orders</p>
            <p className='font-bold'>{stats.activeOrders}</p>
          </div>
          <BusinessCenterIcon />

        </div>
        <div className='flex justify-between sm:justify-around items-center bg-orange-600 text-white w-full md:w-[320px] sm:w-[185px] px-4 py-3 rounded-lg'>
          <div className='flex flex-col'>
            <p className='text-[14px] font-normal'>Loyalty Point</p>
            <p className='font-bold'>{stats.loyaltyPoints}</p>
          </div>
          <PaymentsIcon />

        </div>
      </div>
      {/* Bottom Section */}
      <div className='flex flex-col lg:flex-row gap-5 md:px-20 px-10'>

        <div className='bg-gray-100 border-2 border-orange-600 px-5 py-3 w-full lg:w-[50%] rounded-2xl'>
          <p className='text-black text-xl font-semibold'>Quick Actions</p>
          <div className='flex flex-col gap-4 mt-6'>
            <div
              onClick={() => navigate('/profile/orders')}
              className='flex border-2  justify-center px-3 py-2 rounded-full gap-4 border-orange-600 cursor-pointer hover:bg-orange-50 transition-colors'>
              <AddIcon sx={{
                color: "black",
                fontSize: "15px",
                marginTop: "5px"

              }} />
              <p className='text-black text-[14px]'>Track my Orders</p>
            </div>
            <div
              onClick={() => navigate('/profile/wishlist')}
              className='flex border-2  justify-center px-3 py-2 rounded-full gap-4 border-orange-600 cursor-pointer hover:bg-orange-50 transition-colors'>
              <FavoriteIcon sx={{
                color: "black",
                fontSize: "15px",
                marginTop: "5px"
              }} />
              <p className='text-black text-[14px] mr-5'>View Wishlist</p>
            </div>
            <div
              onClick={() => navigate('/category')}
              className='flex border-2  justify-center px-3 py-2 rounded-full gap-4 border-orange-600 cursor-pointer hover:bg-orange-50 transition-colors'>
              <WebIcon sx={{
                color: "black",
                fontSize: "15px",
                marginTop: "5px"
              }} />
              <p className='text-black text-[14px]'>Browse Products</p>
            </div>
            <div
              onClick={() => navigate('/profile/settings')}
              className='flex border-2  justify-center px-3 py-2 rounded-full gap-4 border-orange-600 cursor-pointer hover:bg-orange-50 transition-colors'>
              <PersonIcon sx={{
                color: "black",
                fontSize: "15px",
                marginTop: "5px"
              }} />
              <p className='text-black text-[14px] mr-2'>Update Profile</p>
            </div>
          </div>
        </div>
        <div className='bg-gray-100 border-2 border-orange-600 px-5 py-3 w-full lg:w-[50%] rounded-2xl'>
          <div className='flex items-center justify-between'>
            <p className='text-black text-2xl'>Recent Orders</p>
            <p onClick={() => navigate('/profile/orders')} className='text-black text-md font-bold mt-2 cursor-pointer'>View All</p>
          </div>
          <div className='flex flex-col gap-3 mt-4'>
            {orders.length > 0 ? (
              orders.map((order) => (
                <OrderItem key={order.orderId} order={order} />
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">No recent orders</p>
            )}
          </div>
        </div>
      </div>

    </div>
  )
}

export default Overview

const OrderItem = ({ order }) => {
  // Helper to determine status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'Delivered': return 'bg-green-300';
      case 'Processing': return 'bg-amber-300';
      case 'Shipped': return 'bg-blue-300';
      case 'Canceled': return 'bg-red-300';
      default: return 'bg-gray-300';
    }
  };

  return (
    <div className='flex flex-col sm:flex-row border-2 px-3 py-2 rounded-xl gap-4 border-orange-600' >
      <div className='w-full sm:w-[25%] md:w-[20%] rounded-2xl overflow-hidden flex items-center justify-center bg-gray-50 min-h-[80px]'>
        <img 
          src={order.productImageUrl || 'https://placehold.co/120x120/f3f4f6/9ca3af?text=Product'} 
          alt="Order item" 
          className='w-full h-auto object-contain rounded-2xl max-h-[100px]'
          onError={(e) => { e.target.src = 'https://placehold.co/120x120/f3f4f6/9ca3af?text=Product'; }}
        />
      </div>
      <div className='flex flex-col gap-1 sm:justify-center'>
        <p className='text-black font-bold text-sm sm:text-base'>#{order.orderNumber || order.orderId}</p>
        <p className='text-black text-[12px] sm:text-[14px]'>
          {order.productNames && order.productNames.length > 0 
            ? order.productNames.join(', ') 
            : order.productName}
        </p>
        <div className={`text-black text-[10px] sm:text-[12px] ${getStatusColor(order.overallStatus || order.status)} w-32 py-1 flex justify-center rounded-full shadow-sm font-medium uppercase tracking-wider`}>
          {order.overallStatus || order.status}
        </div>
      </div>
    </div>

  )
}