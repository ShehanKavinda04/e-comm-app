// src/components/orders/MyOrders.jsx
import React, { useState, useEffect, useContext } from 'react';
import { Package } from 'lucide-react';
import OrderItemCard from './OrderItemCard';
import OrderDetailsModal from './OrderDetailsModal';
import ContactSellerModal from './ContactSellerModal';
import { getUserOrders, getOrderDetails } from '../../../Services/orderService';
import { AuthContext } from '../../../Contexts/AuthContext';

const isRealToken = () => {
  return !!localStorage.getItem('token');
};

const statusOptions = [
  { label: 'All', value: 'all' },
  { label: 'Processing', value: 'Processing' }, // Case sensitive match with mock data
  { label: 'Shipped', value: 'Shipped' },
  { label: 'Delivered', value: 'Delivered' },
  { label: 'Canceled', value: 'Canceled' },
];

const MyOrders = () => {
  const { user } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [contactOrder, setContactOrder] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);

  const handleFetchAndShowDetails = async (orderSummary, type) => {
    setLoadingDetails(true);
    try {
      const fullDetails = await getOrderDetails(orderSummary.orderId || orderSummary.id);
      if (type === 'details') setSelectedOrder(fullDetails);
      else if (type === 'contact') setContactOrder(fullDetails);
    } catch (error) {
      console.error('Failed to load order details:', error);
    } finally {
      setLoadingDetails(false);
    }
  };

  useEffect(() => {
    let intervalId;

    const fetchOrders = async () => {
      // In a real app, backend uses JWT for identity, but we just check if logged in
      if (user && isRealToken()) {
        try {
          const filterParam = activeFilter === 'Canceled' ? 'CANCELLED' : activeFilter;
          const fetchedOrders = await getUserOrders(filterParam);
          setOrders(fetchedOrders);
        } catch (error) {
          console.error('Error fetching orders:', error);
        }
      }
    };

    fetchOrders(); // Initial fetch

    // Poll every 5 seconds for real-time updates
    intervalId = setInterval(fetchOrders, 5000);

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [user, activeFilter]);

  const filteredOrders = orders;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
          <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>

          <div className="flex flex-wrap gap-3">
            {statusOptions.map(({ label, value }) => (
              <button
                key={value}
                onClick={() => setActiveFilter(value)}
                className={`flex items-center gap-2 px-5 py-2 rounded-full border-2 transition-all text-sm font-bold
                  ${activeFilter === value
                    ? 'bg-orange-600 !text-white border-orange-600'
                    : 'bg-white !text-black border-gray-300 hover:border-orange-600 hover:text-orange-600'}`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Orders List */}
        {filteredOrders.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl shadow">
            <Package size={64} className="mx-auto text-gray-400 mb-4" />
            <p className="text-xl font-medium text-gray-600">No orders found</p>
            <p className="text-gray-500 mt-2">You haven't placed any orders yet.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredOrders.map((order) => (
              <OrderItemCard
                key={order.orderId || order.id || Math.random()}
                order={order}
                onViewDetails={(o) => handleFetchAndShowDetails(o, 'details')}
                onContactSeller={(o) => handleFetchAndShowDetails(o, 'contact')}
              />
            ))}
          </div>
        )}
      </div>

      {/* Modals */}
      {selectedOrder && (
        <OrderDetailsModal order={selectedOrder} onClose={() => setSelectedOrder(null)} />
      )}
      {contactOrder && (
        <ContactSellerModal order={contactOrder} onClose={() => setContactOrder(null)} />
      )}
    </div>
  );
};

export default MyOrders;