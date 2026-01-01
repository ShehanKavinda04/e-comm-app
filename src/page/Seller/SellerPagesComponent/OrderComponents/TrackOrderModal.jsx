import React from 'react';
import CloseIcon from '@mui/icons-material/Close';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';

const TrackOrderModal = ({ isOpen, onClose, order }) => {
    if (!isOpen || !order) return null;

    const steps = ['Order Placed', 'Processing', 'Shipped', 'Delivered'];

    const getCurrentStepIndex = (status) => {
        switch (status) {
            case 'Processing': return 1;
            case 'Shipped': return 2;
            case 'Delivered': return 3;
            default: return 0; // "Order Placed" assumed if unknown or just started
        }
    };

    const currentStep = getCurrentStepIndex(order.status);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">
                {/* Header */}
                <div className="bg-orange-600 p-6 flex justify-between items-start text-white">
                    <div>
                        <h2 className="text-2xl font-bold">Track Order</h2>
                        <p className="opacity-90 mt-1">Order ID: {order.id}</p>
                        <p className="opacity-90 mt-0.5 text-sm">Tracking No: {order.trackingNumber || 'N/A'}</p>
                        <p className="opacity-90 text-sm mt-1">Estimated Delivery: {order.status === 'Delivered' ? 'Delivered' : order.expectedDelivery || 'Pending'}</p>
                    </div>
                    <button onClick={onClose} className="text-white hover:bg-orange-700 rounded-full p-1 transition cursor-pointer">
                        <CloseIcon />
                    </button>
                </div>

                <div className="p-8">
                    <div className="relative">
                        {/* Timeline Line */}
                        <div className="absolute left-6 top-4 bottom-4 w-0.5 bg-gray-200"></div>

                        {/* Steps */}
                        <div className="space-y-8 relative">
                            {steps.map((step, index) => {
                                const isCompleted = index <= currentStep;
                                const isCurrent = index === currentStep;

                                return (
                                    <div key={step} className="flex items-center gap-4">
                                        <div className={`relative z-10 bg-white ${isCompleted ? 'text-green-500' : 'text-gray-300'}`}>
                                            {isCompleted ? <CheckCircleIcon fontSize="large" /> : <RadioButtonUncheckedIcon fontSize="large" />}
                                        </div>
                                        <div className="flex-1">
                                            <p className={`font-bold text-lg ${isCompleted ? 'text-black' : 'text-gray-400'}`}>
                                                {step}
                                            </p>
                                            {isCurrent && (
                                                <p className="text-sm text-orange-600 font-medium">
                                                    Current Status
                                                </p>
                                            )}
                                            {index === 0 && <p className="text-xs text-gray-400">{order.date}</p>}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                <div className="bg-gray-50 p-6 text-center border-t border-gray-100">
                    <button onClick={onClose} className="text-orange-600 font-bold hover:underline cursor-pointer">
                        Back to Orders
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TrackOrderModal;
