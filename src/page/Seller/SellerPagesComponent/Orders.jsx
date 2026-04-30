import React, { useState, useEffect, useContext } from 'react';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import LocalPhoneIcon from '@mui/icons-material/LocalPhone';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSellerOrders, updateOrderItemStatusThunk } from '../../../Store/ReduxSlice/sellerSlice';
import ViewOrderModal from './OrderComponents/ViewOrderModal';
import TrackOrderModal from './OrderComponents/TrackOrderModal';
import { AuthContext } from '../../../Contexts/AuthContext';

const Orders = () => {
  const [activeTab, setActiveTab] = useState('All');
  const dispatch = useDispatch();
  const { user } = useContext(AuthContext);
  const { allOrders, isLoading } = useSelector((state) => state.seller);

  // Modal States
  const [viewOrder, setViewOrder] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [trackOrder, setTrackOrder] = useState(null);
  const [isTrackModalOpen, setIsTrackModalOpen] = useState(false);

  useEffect(() => {
    if (user?.token) {
      dispatch(fetchSellerOrders({ token: user.token }));
    }

    // Real-time synchronization via SSE
    if (!user?.token) return;

    let eventSource;
    const connectSSE = () => {
      const sseUrl = "/api/ads/stream";
      eventSource = new EventSource(sseUrl);

      eventSource.addEventListener("DASHBOARD_UPDATE", (event) => {
        console.log("Orders List: Real-time update received via SSE");
        dispatch(fetchSellerOrders({ token: user.token }));
      });

      eventSource.onerror = () => {
        eventSource.close();
        setTimeout(connectSSE, 5000);
      };
    };

    connectSSE();
    return () => {
      if (eventSource) eventSource.close();
    };
  }, [dispatch, user?.token]);

  const orders = allOrders || [];

  const filteredOrders = activeTab === 'All'
    ? orders
    : orders.filter(order => order.status?.toUpperCase() === activeTab.toUpperCase());

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
              <p className='text-black text-2xl font-bold'>Order List ({filteredOrders.length})</p>
              {isLoading && <span className="text-sm font-bold text-orange-600 animate-pulse">Synchronizing...</span>}
            </div>

            {filteredOrders.length > 0 ? (
              filteredOrders.map((order) => (
                <OrderItemCard
                  key={order.id}
                  order={order}
                  onView={() => handleView(order)}
                  onTrack={() => handleTrack(order)}
                  token={user?.token}
                />
              ))
            ) : (
              <div className="text-center py-20 bg-white rounded-xl border border-dashed border-gray-400">
                <p className="text-gray-500">No {activeTab !== 'All' ? activeTab.toLowerCase() : ''} orders found.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Detail Modals */}
      <ViewOrderModal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        order={viewOrder}
      />
      <TrackOrderModal
        isOpen={isTrackModalOpen}
        onClose={() => setIsTrackModalOpen(false)}
        order={trackOrder}
        token={user?.token}
      />
    </div>
  )
}

export default Orders

const OrderItemCard = ({ order, onView, onTrack, token }) => {
  const dispatch = useDispatch();
  const [isUpdating, setIsUpdating] = useState(false);

  const handleStatusChange = async (e) => {
    const newStatus = e.target.value;
    setIsUpdating(true);
    try {
      await dispatch(updateOrderItemStatusThunk({ 
        token, 
        itemId: order.id, 
        status: newStatus 
      })).unwrap();
    } catch (err) {
      console.error("Status Update Error:", err);
      alert("Failed to update status. Please try again.");
    } finally {
      setIsUpdating(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toUpperCase()) {
      case 'PROCESSING': return 'bg-orange-600 text-white';
      case 'SHIPPED': return 'bg-blue-600 text-white';
      case 'DELIVERED': return 'bg-green-600 text-white';
      case 'CANCELLED': return 'bg-red-600 text-white';
      default: return 'bg-gray-600 text-white';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className={`border border-orange-200 rounded-xl p-6 bg-white shadow-sm transition-all hover:shadow-md ${isUpdating ? 'opacity-60 grayscale-[0.5] pointer-events-none' : ''}`}>
      {/* Upper Info Section */}
      <div className='flex justify-between items-start mb-6'>
        <div className='flex gap-4'>
          <div className='w-16 h-16 bg-gray-50 rounded-lg overflow-hidden border border-gray-100 flex items-center justify-center'>
            <img
              src={order.productImage || "https://placehold.co/100x100/f3f4f6/9ca3af?text=Product"}
              alt="Product"
              className='w-full h-full object-contain'
              onError={(e) => {
                e.target.src = "https://placehold.co/100x100/f3f4f6/9ca3af?text=Product";
              }}
            />
          </div>
          <div>
            <div className='flex items-center gap-2'>
              <span className='font-bold text-xl'>#{order.orderNumber || order.id}</span>
            </div>
            <p className='text-xs text-gray-400 font-medium'>Placed on {formatDate(order.orderDate)}</p>
            <p className='text-sm font-bold text-gray-800 mt-1 uppercase'>{order.productName}</p>
          </div>
        </div>
        
        <div className='text-right'>
          <p className='font-black text-xl text-black'>Rs. {(order.subtotal || 0).toLocaleString()}</p>
          
          {/* Status Select with real-time feedback */}
          <div className="mt-3">
            <select
              value={order.status?.toUpperCase()}
              onChange={handleStatusChange}
              disabled={isUpdating}
              className={`text-xs font-black px-4 py-2 rounded-full border-none cursor-pointer focus:outline-none focus:ring-4 focus:ring-orange-100 transition-all ${getStatusColor(order.status)}`}
            >
              <option value="PROCESSING">PROCESSING</option>
              <option value="SHIPPED">SHIPPED</option>
              <option value="DELIVERED">DELIVERED</option>
              <option value="CANCELLED">CANCELLED</option>
            </select>
            {isUpdating && <p className="text-[10px] text-orange-600 mt-1 font-bold animate-pulse">Syncing...</p>}
          </div>
        </div>
      </div>

      {/* Tracking / Metadata Row */}
      <div className='bg-blue-50/50 rounded-xl p-4 flex justify-between items-center mb-6 border border-blue-100'>
        <div className='flex flex-col'>
          <span className='text-[10px] font-black text-blue-800 uppercase tracking-tighter'>Tracking ID</span>
          <span className='text-sm text-blue-900 font-mono font-bold'>{order.trackingNumber || 'UNASSIGNED'}</span>
        </div>
        <div className='text-right flex flex-col'>
          <span className='text-[10px] font-black text-blue-800 uppercase tracking-tighter'>Est. Delivery</span>
          <span className='text-sm text-blue-900 font-bold'>{formatDate(order.expectedDelivery)}</span>
        </div>
      </div>

      {/* Action Buttons Row */}
      <div className='flex justify-between items-center'>
        <div className='flex gap-3'>
          <button
            onClick={onView}
            className='flex items-center gap-2 border-2 border-gray-200 rounded-xl px-5 py-2.5 text-sm font-black hover:border-gray-400 hover:bg-gray-50 transition-all text-gray-700 cursor-pointer'
          >
            <RemoveRedEyeIcon sx={{ fontSize: 18 }} />
            View
          </button>
          <button
            onClick={onTrack}
            className='flex items-center gap-2 border-2 border-gray-200 rounded-xl px-5 py-2.5 text-sm font-black hover:border-gray-400 hover:bg-gray-50 transition-all text-gray-700 cursor-pointer'
          >
            <LocalShippingIcon sx={{ fontSize: 18 }} />
            Logistics
          </button>
        </div>
        
        <div className='flex items-center gap-4'>
            <a
                href={order.customerPhone !== 'N/A' ? `tel:${order.customerPhone}` : '#'}
                onClick={(e) => {
                    if (order.customerPhone === 'N/A') {
                        e.preventDefault();
                        alert("Customer contact information is not available.");
                    }
                }}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all font-bold ${order.customerPhone !== 'N/A' ? 'bg-orange-50 text-orange-700 hover:bg-orange-100 cursor-pointer' : 'opacity-30 cursor-not-allowed'}`}
            >
                <LocalPhoneIcon sx={{ fontSize: 20 }} />
                <span>Contact Customer</span>
            </a>
        </div>
      </div>
    </div>
  )
}