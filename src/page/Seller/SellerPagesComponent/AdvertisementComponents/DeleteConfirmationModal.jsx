import React from 'react';
import DeleteIcon from '@mui/icons-material/Delete';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';

const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm, campaignName, isLoading }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4 animate-in fade-in duration-300">
      <div 
        className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-4 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-8 text-center">
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <WarningAmberIcon className="text-red-500 w-8 h-8" />
          </div>
          
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Delete Campaign?</h3>
          <p className="text-gray-500 mb-8 leading-relaxed">
            Are you sure you want to delete <span className="font-semibold text-gray-800">"{campaignName}"</span>? 
            This action cannot be undone and will remove all associated metrics.
          </p>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 px-6 py-3 rounded-xl border border-gray-200 text-gray-700 font-semibold hover:bg-gray-50 transition-all active:scale-95 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              disabled={isLoading}
              className="flex-1 px-6 py-3 rounded-xl bg-red-600 text-white font-semibold hover:bg-red-700 shadow-lg shadow-red-200 transition-all active:scale-95 flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  <DeleteIcon className="w-5 h-5" />
                  Delete Now
                </>
              )}
            </button>
          </div>
        </div>
        
        {/* Decorative footer */}
        <div className="bg-gray-50 px-8 py-4 border-t border-gray-100 flex justify-center">
          <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">TechNova Ad Solutions</p>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;
