import React from 'react';

const LogoutModal = ({ isOpen, onClose, onConfirm }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden transform transition-all scale-100">
                <div className="p-6 text-center">
                    <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-6">
                        <svg className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Log Out?</h3>
                    <p className="text-gray-500 mb-6">
                        Are you sure you want to log out of your account? You will need to login again to access your profile.
                    </p>
                    <div className="flex gap-3">
                        <button
                            onClick={onClose}
                            className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={onConfirm}
                            className="flex-1 px-4 py-3 bg-red-600 text-white font-semibold rounded-xl hover:bg-red-700 transition-colors shadow-lg shadow-red-200"
                        >
                            Yes, Log Out
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LogoutModal;
