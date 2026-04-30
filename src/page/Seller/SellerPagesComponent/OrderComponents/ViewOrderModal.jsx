import React from 'react';
import CloseIcon from '@mui/icons-material/Close';
import api from '../../../../Services/api';

const ViewOrderModal = ({ isOpen, onClose, order }) => {
    if (!isOpen || !order) return null;

    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const handleDownloadInvoice = async () => {
        try {
            const orderId = order.orderId || order.id;
            const response = await api.get(`/orders/${orderId}/invoice`, {
                responseType: 'blob'
            });
            
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `Invoice-${order.orderNumber || orderId}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            console.error("Failed to download invoice:", error);
            alert("Failed to generate invoice. Please try again.");
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b border-gray-100">
                    <div>
                        <h2 className="text-2xl font-bold text-black">Order Details</h2>
                        <p className="text-gray-500 text-sm mt-1">Order ID: #{order.orderNumber || order.id} • {formatDate(order.orderDate)}</p>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-black transition cursor-pointer">
                        <CloseIcon />
                    </button>
                </div>

                <div className="p-6 space-y-8">
                    {/* Status Bar */}
                    <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-lg border border-gray-100">
                        <span className="text-gray-700 font-medium">Current Status:</span>
                        <span className={`px-3 py-1 rounded-full text-sm font-semibold 
                            ${order.status === 'PROCESSING' ? 'bg-orange-100 text-orange-800' :
                                order.status === 'SHIPPED' ? 'bg-blue-100 text-blue-800' :
                                    order.status === 'DELIVERED' ? 'bg-green-100 text-green-800' : 
                                        'bg-red-100 text-red-800'}`}>
                            {order.status}
                        </span>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                        {/* Customer Details */}
                        <div>
                            <h3 className="text-lg font-bold text-black mb-3">Customer Information</h3>
                            <div className="space-y-1">
                                <p className="text-gray-800 font-bold">{order.customerName}</p>
                                <p className="text-gray-600">{order.customerEmail}</p>
                                <p className="text-gray-600">{order.customerPhone}</p>
                            </div>
                        </div>

                        {/* Shipping Address */}
                        <div>
                            <h3 className="text-lg font-bold text-black mb-3">Shipping Logistics</h3>
                            <div className="space-y-1">
                                <p className="text-gray-700 whitespace-pre-wrap">{order.shippingAddress || 'No address provided'}</p>
                                {order.trackingNumber && (
                                    <p className="text-sm font-mono text-blue-600 mt-2">Tracking: {order.trackingNumber}</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Order Items */}
                    <div>
                        <h3 className="text-lg font-bold text-black mb-4">Product Summary</h3>
                        <div className="border rounded-lg overflow-hidden">
                            <table className="w-full text-left">
                                <thead className="bg-gray-50 border-b">
                                    <tr>
                                        <th className="p-3 text-gray-600 font-medium text-sm">Product</th>
                                        <th className="p-3 text-gray-600 font-medium text-sm text-right">Unit Price</th>
                                        <th className="p-3 text-gray-600 font-medium text-sm text-right">Qty</th>
                                        <th className="p-3 text-gray-600 font-medium text-sm text-right">Subtotal</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr className="border-b last:border-0">
                                        <td className="p-3">
                                            <div className="flex items-center gap-3">
                                                {order.productImage && (
                                                    <img src={order.productImage} alt="" className="w-8 h-8 rounded object-cover" />
                                                )}
                                                <span className="text-gray-800 font-medium">{order.productName}</span>
                                            </div>
                                        </td>
                                        <td className="p-3 text-gray-600 text-right">Rs. {(order.unitPrice || 0).toLocaleString()}</td>
                                        <td className="p-3 text-gray-600 text-right">{order.quantity}</td>
                                        <td className="p-3 text-gray-800 font-bold text-right">Rs. {(order.subtotal || 0).toLocaleString()}</td>
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
                                <span>Rs. {(order.subtotal || 0).toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-gray-600">
                                <span>Shipping & Handling</span>
                                <span>Rs. 0.00</span>
                            </div>
                            <div className="flex justify-between text-black font-bold text-lg pt-2 border-t">
                                <span>Order Total</span>
                                <span>Rs. {(order.subtotal || 0).toLocaleString()}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-gray-100 flex justify-end gap-3">
                    <button onClick={onClose} className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition font-medium cursor-pointer">
                        Close
                    </button>
                    <button 
                        onClick={handleDownloadInvoice}
                        className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition font-medium shadow-md cursor-pointer"
                    >
                        Download Invoice
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ViewOrderModal;
