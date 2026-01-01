// src/components/orders/ContactSellerModal.jsx
import React, { useState } from 'react';
import { X, Mail, Phone, Send } from 'lucide-react';
import { formatDate } from './utils';

const ContactSellerModal = ({ order, onClose }) => {
  const [message, setMessage] = useState(
    `Hello, I have a query regarding my order #${order.id} placed on ${formatDate(order.date)}.\n\nItems: ${order.items.map(i => i.name).join(', ')}\n\nPlease let me know...`
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Your message has been sent to the seller! (This is a demo)');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl">
        <div className="border-b px-8 py-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Contact Seller</h2>
            <p className="text-sm text-gray-600 mt-1">{order.seller.name}</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 transition">
            <X size={24} />
          </button>
        </div>

        <div className="p-8 space-y-6">
          <div className="flex items-center gap-3 text-gray-700">
            <Mail size={20} />
            <span>{order.seller.email}</span>
          </div>
          <div className="flex items-center gap-3 text-gray-700">
            <Phone size={20} />
            <span>{order.seller.phone}</span>
          </div>

          <form onSubmit={handleSubmit}>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Your Message
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={6}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none text-black"
              placeholder="Type your message here..."
            />

            <div className="flex justify-end gap-4 mt-6">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-100 transition text-black font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-8 py-3 bg-orange-600 text-white font-medium rounded-lg hover:bg-orange-700 transition flex items-center gap-2"
              >
                <Send size={18} />
                Send Message
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContactSellerModal;