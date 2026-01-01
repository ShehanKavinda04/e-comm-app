import React from 'react';

const StatusModal = ({ isOpen, onClose, type, title, message }) => {
    if (!isOpen) return null;

    const isSuccess = type === 'success';

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden transform transition-all scale-100">
                <div className="p-6 text-center">
                    <div className={`mx-auto flex items-center justify-center h-16 w-16 rounded-full mb-6 ${isSuccess ? 'bg-green-100' : 'bg-red-100'}`}>
                        {isSuccess ? (
                            <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                            </svg>
                        ) : (
                            <svg className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                        )}
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
                    <p className="text-gray-500 mb-6">
                        {message}
                    </p>
                    <div className="flex justify-center">
                        <button
                            onClick={onClose}
                            className={`w-full px-4 py-3 text-white font-bold rounded-xl shadow-lg transition-colors ${isSuccess ? 'bg-green-600 hover:bg-green-700 shadow-green-200' : 'bg-red-600 hover:bg-red-700 shadow-red-200'}`}
                        >
                            {isSuccess ? 'Continue' : 'Try Again'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StatusModal;
