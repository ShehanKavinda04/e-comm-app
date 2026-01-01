// src/components/DeleteConfirmModal.jsx
import React from 'react';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';

const DeleteConfirmModal = ({ product, isOpen, onConfirm, onCancel }) => {
  if (!isOpen || !product) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 w-full max-w-md mx-4 shadow-2xl">
        <div className="flex flex-col items-center text-center space-y-6">
          <WarningAmberIcon sx={{ fontSize: 60, color: '#f59e0b' }} />
          <div>
            <h2 className="text-2xl font-bold text-black">Delete Product?</h2>
            <p className="text-gray-600 mt-3">
              Are you sure you want to delete <strong>{product.name}</strong>?
              This action cannot be undone.
            </p>
          </div>
          <div className="flex gap-4 w-full">
            <button
              onClick={onConfirm}
              className="flex-1 bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition cursor-pointer"
            >
              Yes, Delete
            </button>
            <button
              onClick={onCancel}
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

export default DeleteConfirmModal;