import React, { useState } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import { useDispatch } from 'react-redux';
import { updateOrderItemStatusThunk } from '../../../../Store/ReduxSlice/sellerSlice';

const TrackOrderModal = ({ isOpen, onClose, order, token }) => {
    const dispatch = useDispatch();
    const [trackingInput, setTrackingInput] = useState(order?.trackingNumber || '');
    const [isSaving, setIsSaving] = useState(false);

    if (!isOpen || !order) return null;

    const steps = ['Order Placed', 'Processing', 'Shipped', 'Delivered'];

    const getCurrentStepIndex = (status) => {
        const s = status?.toUpperCase();
        switch (s) {
            case 'PROCESSING': return 1;
            case 'SHIPPED': return 2;
            case 'DELIVERED': return 3;
            default: return 0;
        }
    };

    const currentStep = getCurrentStepIndex(order.status);

    const handleUpdateTracking = async () => {
        if (!trackingInput.trim()) return;
        setIsSaving(true);
        try {
            await dispatch(updateOrderItemStatusThunk({
                token,
                itemId: order.id,
                trackingNumber: trackingInput
            })).unwrap();
            onClose();
        } catch (err) {
            alert("Update failed: " + err);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className={`bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden transition-opacity ${isSaving ? 'opacity-70' : ''}`}>
                {/* Header */}
                <div className="bg-orange-600 p-6 flex justify-between items-start text-white">
                    <div>
                        <h2 className="text-2xl font-bold">Track & Update</h2>
                        <p className="opacity-90 mt-1">Order ID: #{order.orderNumber || order.id}</p>
                    </div>
                    <button onClick={onClose} className="text-white hover:bg-orange-700 rounded-full p-1 transition cursor-pointer">
                        <CloseIcon />
                    </button>
                </div>

                <div className="p-8">
                    {/* Tracking Number Update Section */}
                    <div className="mb-10 bg-gray-50 p-4 rounded-xl border border-gray-100">
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Assign/Update Tracking Number</label>
                        <div className="flex gap-2">
                            <input 
                                type="text"
                                value={trackingInput}
                                onChange={(e) => setTrackingInput(e.target.value)}
                                placeholder="Enter tracking number (e.g. TN-123456)"
                                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                            />
                            <button 
                                onClick={handleUpdateTracking}
                                disabled={isSaving || trackingInput === order.trackingNumber}
                                className="bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition cursor-pointer"
                            >
                                {isSaving ? 'Saving...' : 'Save'}
                            </button>
                        </div>
                    </div>

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
                                                    Current Logistics Stage
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                <div className="bg-gray-50 p-6 text-center border-t border-gray-100">
                    <button onClick={onClose} className="text-gray-500 font-bold hover:text-black cursor-pointer transition">
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TrackOrderModal;
