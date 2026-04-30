// src/components/orders/OrderDetailsModal.jsx
import React from 'react';
import { X, ShoppingBag, MapPin, CreditCard, Truck, FileText } from 'lucide-react';
import { formatDate, getStatusBadge, getTrackingUrl } from './utils';
import api from '../../../Services/api';

const OrderDetailsModal = ({ order, onClose }) => {
  if (!order) return null;

  const trackingUrl = getTrackingUrl(order.tracking, order.trackingProvider);

  const handleDownloadInvoice = async () => {
    try {
      const orderId = order.id || order.orderId;
      const response = await api.get(`/orders/${orderId}/invoice`, {
        responseType: 'blob'
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Invoice-${order.orderNumber || orderId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Failed to download invoice:", error);
      alert("Failed to generate invoice. Please try again.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="sticky top-0 bg-white border-b px-8 py-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Order #{order.orderNumber}</h2>
            <p className="text-sm text-gray-600 mt-1">Placed on {formatDate(order.orderedAt)}</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 transition">
            <X size={24} />
          </button>
        </div>

        <div className="p-8 space-y-8">

          {/* Order Status */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-gray-700">Payment Status</p>
              <div className="mt-1">{getStatusBadge(order.paymentStatus || 'PENDING')}</div>
            </div>
            <div className="text-right">
              <p className="text-sm font-semibold text-gray-700">Tracking Number</p>
              <p className="text-base font-medium">{order.tracking || (order.items && order.items.length > 0 && order.items[0].trackingNumber) || 'Pending'}</p>
            </div>
          </div>

          {/* Items */}
          <div>
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2 text-gray-900">
              <ShoppingBag size={20} />
              Ordered Items
            </h3>
            <div className="space-y-6">
              {order.items.map((item, idx) => (
                <div key={idx} className="flex gap-4 border-b pb-6 last:border-b-0">
                  <div className="w-24 h-24 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                      onError={(e) => (e.target.src = 'https://via.placeholder.com/150?text=No+Image')}
                    />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-lg text-gray-900">{item.productName}</p>
                    <p className="text-sm text-gray-600 mt-1">Qty: {item.quantity}</p>
                    <p className="text-lg font-bold mt-2 text-gray-900">
                      Rs. {item.unitPrice.toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Shipping Address */}
          <div>
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2 text-gray-900">
              <MapPin size={20} />
              Shipping Address
            </h3>
            <p className="text-gray-700 leading-relaxed">{order.shippingAddress || 'Not provided (Check with seller)'}</p>
          </div>

          {/* Payment Summary */}
          <div className="bg-gray-50 rounded-xl p-6">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2 text-gray-900">
              <CreditCard size={20} />
              Payment Summary
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between text-gray-900 font-medium border-b pb-2">
                <span>Payment Method</span>
                <span className="text-orange-600 font-bold">{order.paymentMethod || 'N/A'}</span>
              </div>
              <div className="border-t pt-3 flex justify-between font-bold text-lg text-black">
                <span>Total</span>
                <span>Rs. {order.totalAmount.toLocaleString()}</span>
              </div>
            </div>
            <p className="text-sm text-gray-600 mt-4 italic text-right">
              Payment via {order.paymentMethod || 'Credit/Debit Card (Secured)'}
            </p>
          </div>

          {/* Track Order Button */}
          <div className="text-center">
            <a
              target={trackingUrl || (order.items && order.items.length > 0 && order.items[0].trackingNumber) ? "_blank" : "_self"}
              rel="noopener noreferrer"
              className={`inline-flex items-center gap-2 px-8 py-4 font-medium rounded-xl transition shadow-lg ${
                (trackingUrl || (order.items && order.items.length > 0 && order.items[0].trackingNumber))
                  ? 'bg-orange-600 text-white hover:bg-orange-700'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed border border-gray-300'
              }`}
              onClick={(e) => {
                if (!trackingUrl && !(order.items && order.items.length > 0 && order.items[0].trackingNumber)) {
                  e.preventDefault();
                  alert('Tracking link will be available once the order is shipped!');
                }
              }}
            >
              <Truck size={20} />
              { (trackingUrl || (order.items && order.items.length > 0 && order.items[0].trackingNumber)) ? 'Track Shipment Live' : 'Tracking Link Pending' }
            </a>
          </div>
        </div>

        <div className="sticky bottom-0 bg-white border-t px-8 py-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-8 py-3 bg-gray-600 text-white font-medium rounded-lg hover:bg-gray-700 transition"
          >
            Close
          </button>
          <button
            onClick={handleDownloadInvoice}
            className="px-8 py-3 bg-orange-600 text-white font-medium rounded-lg hover:bg-orange-700 transition flex items-center gap-2"
          >
            <FileText size={20} />
            Download Invoice
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsModal;