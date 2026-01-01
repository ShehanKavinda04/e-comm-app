import React from 'react';
import CloseIcon from '@mui/icons-material/Close';

const ViewOrderModal = ({ isOpen, onClose, order }) => {
    if (!isOpen || !order) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b border-gray-100">
                    <div>
                        <h2 className="text-2xl font-bold text-black">Order Details</h2>
                        <p className="text-gray-500 text-sm mt-1">Order ID: {order.id} • {order.date}</p>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-black transition cursor-pointer">
                        <CloseIcon />
                    </button>
                </div>

                <div className="p-6 space-y-8">
                    {/* Status Bar */}
                    <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-lg border border-gray-100">
                        <span className="text-gray-700 font-medium">Status:</span>
                        <span className={`px-3 py-1 rounded-full text-sm font-semibold 
                            ${order.status === 'Processing' ? 'bg-orange-100 text-orange-800' :
                                order.status === 'Shipped' ? 'bg-blue-100 text-blue-800' :
                                    'bg-green-100 text-green-800'}`}>
                            {order.status}
                        </span>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                        {/* Customer Details */}
                        <div>
                            <h3 className="text-lg font-bold text-black mb-3">Customer</h3>
                            <div className="space-y-1">
                                <p className="text-gray-800 font-medium">{order.customerName || order.name || 'N/A'}</p>
                                <p className="text-gray-600">customer@example.com</p>
                                <p className="text-gray-600">+94 77 123 4567</p>
                            </div>
                        </div>

                        {/* Shipping Address */}
                        <div>
                            <h3 className="text-lg font-bold text-black mb-3">Shipping Address</h3>
                            <div className="space-y-1">
                                <p className="text-gray-600">123/4, Main Street</p>
                                <p className="text-gray-600">Colombo 03</p>
                                <p className="text-gray-600">Western Province, Sri Lanka</p>
                            </div>
                        </div>
                    </div>

                    {/* Order Items */}
                    <div>
                        <h3 className="text-lg font-bold text-black mb-4">Items</h3>
                        <div className="border rounded-lg overflow-hidden">
                            <table className="w-full text-left">
                                <thead className="bg-gray-50 border-b">
                                    <tr>
                                        <th className="p-3 text-gray-600 font-medium text-sm">Product</th>
                                        <th className="p-3 text-gray-600 font-medium text-sm text-right">Price</th>
                                        <th className="p-3 text-gray-600 font-medium text-sm text-right">Qty</th>
                                        <th className="p-3 text-gray-600 font-medium text-sm text-right">Total</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr className="border-b last:border-0">
                                        <td className="p-3 text-gray-800">{order.productName || order.item}</td>
                                        <td className="p-3 text-gray-600 text-right">Rs. {(order.amount / order.quantity || order.price).toLocaleString()}</td>
                                        <td className="p-3 text-gray-600 text-right">{order.quantity || 1}</td>
                                        <td className="p-3 text-gray-800 font-medium text-right">Rs. {(order.amount || order.price).toLocaleString()}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Payment Summary */}
                    <div className="flex justify-end">
                        <div className="w-full md:w-1/2 space-y-2">
                            <div className="flex justify-between text-gray-600">
                                <span>Subtotal</span>
                                <span>Rs. {(order.amount || order.price).toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-gray-600">
                                <span>Shipping</span>
                                <span>Rs. 350</span>
                            </div>
                            <div className="flex justify-between text-black font-bold text-lg pt-2 border-t">
                                <span>Total</span>
                                <span>Rs. {((order.amount || order.price) + 350).toLocaleString()}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-gray-100 flex justify-end gap-3">
                    <button onClick={onClose} className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition font-medium">
                        Close
                    </button>
                    <button className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition font-medium shadow-md">
                        Download Invoice
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ViewOrderModal;
