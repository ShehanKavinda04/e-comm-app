// src/components/EditProductModal.jsx
import React from 'react';
import CloseIcon from '@mui/icons-material/Close';

const EditProductModal = ({
  editingProduct,
  isOpen,
  onClose,
  onInputChange,
  onSave,
}) => {
  if (!isOpen || !editingProduct) return null;

  return (
    <div className="fixed inset-0 text-black bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 w-full max-w-md mx-4 shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-black">{editingProduct.id ? 'Edit Product' : 'Add Product'}</h2>
          <button onClick={onClose} className="text-gray-500 cursor-pointer hover:text-black">
            <CloseIcon fontSize="large" />
          </button>
        </div>
        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
            <input
              type="text"
              name="name"
              value={editingProduct.name}
              onChange={onInputChange}
              className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-orange-700 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Price (Rs.)</label>
            <input
              type="number"
              name="price"
              value={editingProduct.price}
              onChange={onInputChange}
              min="0"
              className="w-full px-4 py-2 border-2  border-gray-300 rounded-lg focus:border-orange-700 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Stock Quantity</label>
            <input
              type="number"
              name="stock"
              value={editingProduct.stock}
              onChange={onInputChange}
              min="0"
              className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-orange-700 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              name="status"
              value={editingProduct.status}
              onChange={onInputChange}
              className="w-full px-4 py-2 border-2 cursor-pointer border-gray-300 rounded-lg focus:border-orange-700 outline-none"
            >
              <option className='cursor-pointer' value="Processing">Processing</option>
              <option className='cursor-pointer' value="Shipped">Shipped</option>
              <option className='cursor-pointer' value="Delivered">Delivered</option>
            </select>
          </div>
          <div className="flex gap-3 pt-4">
            <button
              onClick={onSave}
              className="flex-1 bg-orange-700 text-white py-3 rounded-lg font-semibold hover:bg-orange-800 transition cursor-pointer"
            >
              Save Changes
            </button>
            <button
              onClick={onClose}
              className="flex-1 bg-gray-200 text-black py-3 rounded-lg font-semibold hover:bg-gray-300 transition cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProductModal;