// src/components/orders/OrderDetailsModal.jsx
import React from 'react';
import { X, Loader2, ShoppingBag, MapPin, CreditCard, Truck } from 'lucide-react';
import { formatDate, getStatusBadge, getTrackingUrl, generateStatusSummary } from './utils';

const OrderDetailsModal = ({ order, onClose }) => {
  if (!order) return null;

  const trackingUrl = getTrackingUrl(order.tracking, order.trackingProvider);
  const statusSummary = generateStatusSummary(order);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="sticky top-0 bg-white border-b px-8 py-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Order #{order.id}</h2>
            <p className="text-sm text-gray-600 mt-1">Placed on {formatDate(order.date)}</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 transition">
            <X size={24} />
          </button>
        </div>

        <div className="p-8 space-y-8">
          {/* AI Status Summary */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-200">
            <h3 className="text-xl font-semibold mb-3 flex items-center gap-2 text-gray-900">
              <Loader2 size={20} className="text-blue-600" />
              Current Status (AI Summary)
            </h3>
            <p className="text-gray-800 leading-relaxed">{statusSummary}</p>
          </div>

          {/* Order Status */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-gray-700">Status</p>
              <div className="mt-1">{getStatusBadge(order.status)}</div>
            </div>
            {order.tracking && (
              <div className="text-right">
                <p className="text-sm font-semibold text-gray-700">Tracking Number</p>
                <p className="text-base font-medium">{order.tracking}</p>
              </div>
            )}
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
                    <p className="font-medium text-lg text-gray-900">{item.name}</p>
                    <p className="text-sm text-gray-600 mt-1">Qty: {item.qty}</p>
                    <p className="text-lg font-bold mt-2 text-gray-900">
                      Rs. {item.price.toLocaleString()}
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
            <p className="text-gray-700 leading-relaxed">{order.shippingAddress}</p>
          </div>

          {/* Payment Summary */}
          <div className="bg-gray-50 rounded-xl p-6">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2 text-gray-900">
              <CreditCard size={20} />
              Payment Summary
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between text-gray-900 font-medium">
                <span>Subtotal</span>
                <span>Rs. {(order.total - 1000).toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-gray-900 font-medium">
                <span>Shipping</span>
                <span>Rs. 500</span>
              </div>
              <div className="flex justify-between text-gray-900 font-medium">
                <span>Taxes (GST)</span>
                <span>Rs. 500</span>
              </div>
              <div className="border-t pt-3 flex justify-between font-bold text-lg text-black">
                <span>Total</span>
                <span>Rs. {order.total.toLocaleString()}</span>
              </div>
            </div>
            <p className="text-sm text-gray-600 mt-4">Paid via {order.paymentMethod}</p>
          </div>

          {/* Track Order Button */}
          {trackingUrl && (
            <div className="text-center">
              <a
                href={trackingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-8 py-4 bg-orange-600 text-white font-medium rounded-xl hover:bg-orange-700 transition shadow-lg"
              >
                <Truck size={20} />
                Track Shipment Live
              </a>
            </div>
          )}
        </div>

        <div className="sticky bottom-0 bg-white border-t px-8 py-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-8 py-3 bg-gray-600 text-white font-medium rounded-lg hover:bg-gray-700 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsModal;