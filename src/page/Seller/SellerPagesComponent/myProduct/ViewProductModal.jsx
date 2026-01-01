// src/components/ViewProductModal.jsx
import React from 'react';
import CloseIcon from '@mui/icons-material/Close';

const ViewProductModal = ({ product, isOpen, onClose, getStatusColor }) => {
  if (!isOpen || !product) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl w-full max-w-2xl mx-4 shadow-2xl overflow-hidden">
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-3xl font-bold text-black">Product Details</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-black transition cursor-pointer">
            <CloseIcon fontSize="large" />
          </button>
        </div>
        <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex justify-center">
              <img
                src={product.image}
                alt={product.name}
                className="w-full max-w-sm h-80 object-cover rounded-2xl shadow-lg"
              />
            </div>
            <div className="space-y-6">
              <div>
                <h3 className="text-2xl font-semibold text-black">{product.name}</h3>
                <p className="text-3xl font-bold text-orange-700 mt-2">
                  Rs. {product.price.toLocaleString()}
                </p>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 font-medium">Stock Quantity:</span>
                  <span className={`font-bold text-lg ${product.stock < 10 ? 'text-red-600' : 'text-green-600'}`}>
                    {product.stock}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 font-medium">Units Sold:</span>
                  <span className="font-bold text-lg text-black">{product.sold}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 font-medium">Status:</span>
                  <span className={`px-4 py-2 rounded-full text-white text-sm font-medium ${getStatusColor(product.status)}`}>
                    {product.status}
                  </span>
                </div>
              </div>
              <div className="pt-6">
                <button
                  onClick={onClose}
                  className="w-full bg-orange-700 text-white py-3 rounded-lg font-semibold hover:bg-orange-800 transition cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewProductModal;