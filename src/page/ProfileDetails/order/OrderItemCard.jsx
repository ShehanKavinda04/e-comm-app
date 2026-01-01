import React from 'react';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';

const OrderItemCard = ({ order, onViewDetails, onContactSeller }) => {
  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'processing': return 'bg-orange-200 text-orange-800';
      case 'shipped': return 'bg-blue-200 text-blue-800';
      case 'delivered': return 'bg-green-200 text-green-800';
      default: return 'bg-gray-200 text-gray-800';
    }
  };

  // Handle data structure differences if any (Seller data vs Buyer data)
  const productId = order.id;
  const productDate = order.date;
  let productName = order.productName || "Product";

  // Logic for Buyer orders (multi-item support)
  if (order.items && order.items.length > 0) {
    productName = order.items[0].name;
    if (order.items.length > 1) {
      productName += ` + ${order.items.length - 1} more`;
    }
  }

  const productPrice = order.total || order.amount || 0;
  const productStatus = order.status;
  const productImage = order.items && order.items.length > 0 ? order.items[0].image : "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=100&h=100&fit=crop";

  return (
    <div className='border border-orange-200 rounded-xl p-6 bg-white shadow-sm'>
      {/* Top Header Section */}
      <div className='flex justify-between items-start mb-4'>
        <div className='flex gap-4'>
          <div className='w-12 h-12 bg-black rounded-xl overflow-hidden'>
            <img
              src={productImage}
              alt="Product"
              className='w-full h-full object-cover'
              onError={(e) => (e.target.src = 'https://via.placeholder.com/150?text=No+Image')}
            />
          </div>
          <div>
            <div className='flex items-center gap-2'>
              <span className='font-bold text-lg'>{productId}</span>
            </div>
            <p className='text-xs text-gray-500'>Ordered on {productDate}</p>
            <p className='text-sm font-medium mt-1'>{productName}</p>
          </div>
        </div>
        <div className='text-right'>
          <p className='font-bold text-lg'>Rs. {productPrice.toLocaleString()}</p>
          <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mt-1 capitalize ${getStatusColor(productStatus)}`}>
            {productStatus}
          </span>
        </div>
      </div>

      {/* Tracking Info Section */}
      <div className='bg-blue-100 rounded-lg p-3 flex justify-between items-center mb-4 border border-blue-200'>
        <div>
          <p className='text-xs font-bold text-black'>Tracking Number</p>
          <p className='text-sm text-gray-700'>{order.tracking || order.trackingNumber || 'Pending'}</p>
        </div>
        <div className='text-right'>
          <p className='text-xs font-bold text-black'>Expected Delivery</p>
          <p className='text-sm text-gray-700'>{order.expectedDelivery || 'Pending'}</p>
        </div>
      </div>

      {/* Actions Section */}
      <div className='flex justify-between items-center'>
        <div className='flex gap-3'>
          <button
            onClick={() => onViewDetails(order)}
            className='flex items-center gap-2 border border-blue-600 rounded-lg px-4 py-2 text-sm font-bold text-blue-700 hover:bg-blue-50 transition'
          >
            <RemoveRedEyeIcon sx={{ fontSize: 18 }} />
            View Details
          </button>
          <button
            className='flex items-center gap-2 border border-orange-600 rounded-lg px-4 py-2 text-sm font-bold text-orange-700 hover:bg-orange-50 transition'
          >
            <LocalShippingIcon sx={{ fontSize: 18 }} />
            Track Order
          </button>
        </div>
        <button
          onClick={() => onContactSeller(order)}
          className='flex items-center gap-2 text-gray-600 hover:text-black cursor-pointer transition'
        >
          <span className='scale-x-[-1]'>📞</span>
          <span className='text-sm font-medium'>Contact Seller</span>
        </button>
      </div>
    </div>
  );
};

export default OrderItemCard;