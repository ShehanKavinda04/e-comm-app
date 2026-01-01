import React, { useState, useEffect } from 'react';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSellerStats, updateOrderStatus } from '../../../Store/ReduxSlice/sellerSlice';
import ViewOrderModal from './OrderComponents/ViewOrderModal';
import TrackOrderModal from './OrderComponents/TrackOrderModal';

const Orders = () => {
  const [activeTab, setActiveTab] = useState('All');
  const dispatch = useDispatch();
  const { stats, isLoading } = useSelector((state) => state.seller);

  // Modal States
  const [viewOrder, setViewOrder] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [trackOrder, setTrackOrder] = useState(null);
  const [isTrackModalOpen, setIsTrackModalOpen] = useState(false);

  useEffect(() => {
    if (!stats || !stats.recentOrders || stats.recentOrders.length === 0) {
      dispatch(fetchSellerStats());
    }
  }, [dispatch, stats]);

  const orders = stats?.recentOrders || [];

  const filteredOrders = activeTab === 'All'
    ? orders
    : orders.filter(order => order.status === activeTab);

  const handleView = (order) => {
    setViewOrder(order);
    setIsViewModalOpen(true);
  };

  const handleTrack = (order) => {
    setTrackOrder(order);
    setIsTrackModalOpen(true);
  };

  return (
    <div className='relative'>
      <div>
        <div className='flex justify-between mx-4 lg:px-20 md:px-10 mb-8'>
          <p className='text-black text-2xl font-semibold '>Order Management</p>
          <div className='flex gap-3'>
            {['All', 'Processing', 'Delivered', 'Shipped'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`text-black border-2 rounded-full px-6 py-1 cursor-pointer transition-colors ${activeTab === tab ? 'bg-black text-white' : 'hover:bg-gray-100'
                  }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
        <div className='lg:px-20 md:px-10'>
          <div className='bg-gray-200 m-5 space-y-5 rounded-2xl px-5 py-8 min-h-[400px]'>
            <div className="flex justify-between items-center mb-4">
              <p className='text-black text-2xl'>Recent Orders ({filteredOrders.length})</p>
              {isLoading && <p className="text-gray-500">Loading...</p>}
            </div>

            {filteredOrders.length > 0 ? (
              filteredOrders.map((order) => (
                <OrderItemCard
                  key={order.id}
                  order={order}
                  onView={() => handleView(order)}
                  onTrack={() => handleTrack(order)}
                />
              ))
            ) : (
              <p className="text-center text-gray-500 py-10">No orders found in this category.</p>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      <ViewOrderModal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        order={viewOrder}
      />
      <TrackOrderModal
        isOpen={isTrackModalOpen}
        onClose={() => setIsTrackModalOpen(false)}
        order={trackOrder}
      />
    </div>
  )
}

export default Orders

const OrderItemCard = ({ order, onView, onTrack }) => {
  const dispatch = useDispatch();

  const handleStatusChange = (e) => {
    dispatch(updateOrderStatus({ id: order.id, status: e.target.value }));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Processing': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'Shipped': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Delivered': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className='border border-orange-200 rounded-xl p-6 bg-white shadow-sm transition-all hover:shadow-md'>
      {/* Top Header Section */}
      <div className='flex justify-between items-start mb-4'>
        <div className='flex gap-4'>
          <div className='w-12 h-12 bg-gray-100 rounded-xl overflow-hidden border border-gray-200'>
            <img
              src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=100&h=100&fit=crop"
              alt="Product"
              className='w-full h-full object-cover'
            />
          </div>
          <div>
            <div className='flex items-center gap-2'>
              <span className='font-bold text-lg'>{order.id}</span>
            </div>
            <p className='text-xs text-gray-500'>Ordered on {order.date}</p>
            <p className='text-sm font-medium mt-1'>{order.item || order.productName}</p>
          </div>
        </div>
        <div className='text-right'>
          <p className='font-bold text-lg'>Rs. {order.price || order.amount.toLocaleString()}</p>

          {/* Status Dropdown */}
          <div className="mt-2">
            <select
              value={order.status}
              onChange={handleStatusChange}
              className={`text-xs font-semibold px-2 py-1 rounded-full border cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-orange-300 ${getStatusColor(order.status)}`}
            >
              <option value="Processing">Processing</option>
              <option value="Shipped">Shipped</option>
              <option value="Delivered">Delivered</option>
              <option value="Canceled">Canceled</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tracking Info Section */}
      <div className='bg-blue-50 rounded-lg p-3 flex justify-between items-center mb-4 border border-blue-100'>
        <div>
          <p className='text-xs font-bold text-gray-700'>Tracking Number</p>
          <p className='text-sm text-gray-900'>{order.trackingNumber || 'TN-' + Math.floor(Math.random() * 1000000)}</p>
        </div>
        <div className='text-right'>
          <p className='text-xs font-bold text-gray-700'>Expected Delivery</p>
          <p className='text-sm text-gray-900'>{order.expectedDelivery || '2025-01-10'}</p>
        </div>
      </div>

      {/* Actions Section */}
      <div className='flex justify-between items-center'>
        <div className='flex gap-3'>
          <button
            onClick={onView}
            className='flex items-center gap-2 border border-gray-300 rounded-lg px-4 py-2 text-sm font-medium hover:bg-gray-50 hover:border-gray-400 transition text-gray-700'
          >
            <RemoveRedEyeIcon sx={{ fontSize: 18 }} />
            View
          </button>
          <button
            onClick={onTrack}
            className='flex items-center gap-2 border border-gray-300 rounded-lg px-4 py-2 text-sm font-medium hover:bg-gray-50 hover:border-gray-400 transition text-gray-700'
          >
            <LocalShippingIcon sx={{ fontSize: 18 }} />
            Track
          </button>
        </div>
        <a
          href={`mailto:${order.customerEmail || 'customer@example.com'}?subject=Order #${order.id}`}
          className='flex items-center gap-2 text-gray-500 hover:text-black cursor-pointer transition'
        >
          <span className='scale-x-[-1] text-lg'>📞</span>
          <span className='text-sm font-medium hidden sm:inline'>Contact Customer</span>
        </a>
      </div>
    </div>
  )
}