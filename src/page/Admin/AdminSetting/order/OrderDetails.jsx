import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getAllOrders } from '../../../../Services/MockDataService';
import { ArrowLeft, Package, User, Calendar, DollarSign, MapPin } from 'lucide-react';

const OrderDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);

    useEffect(() => {
        const orders = getAllOrders();
        // Match ID, handling the "ORD-" prefix if present or not in the URL
        const foundOrder = orders.find(o => o.id === id || o.id === `ORD-${id}`);
        setOrder(foundOrder);
    }, [id]);

    if (!order) {
        return (
            <div className="p-6 bg-gray-50 min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Order Not Found</h2>
                    <button
                        onClick={() => navigate('/admin/order')}
                        className="text-blue-600 hover:underline"
                    >
                        Return to Orders
                    </button>
                </div>
            </div>
        );
    }

    const getStatusColor = (status) => {
        switch (status) {
            case 'Pending': return 'bg-[#fadcb6] text-[#eca609]';
            case 'Delivered': return 'bg-green-100 text-green-600';
            case 'Shipped': return 'bg-blue-100 text-blue-600';
            case 'Canceled': return 'bg-pink-100 text-pink-600';
            case 'Disputed': return 'bg-pink-100 text-pink-600';
            default: return 'bg-gray-100 text-gray-600';
        }
    };

    return (
        <div className="p-6 bg-gray-50 min-h-screen font-sans">
            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
                <button
                    onClick={() => navigate('/admin/order')}
                    className="p-2 hover:bg-gray-200 rounded-full transition-colors"
                >
                    <ArrowLeft className="w-6 h-6 text-gray-700" />
                </button>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Order #{order.id}</h1>
                    <p className="text-sm text-gray-500">View detailed information about this order</p>
                </div>
                <div className={`ml-auto px-4 py-1.5 rounded-full text-sm font-bold ${getStatusColor(order.status)}`}>
                    {order.status}
                </div>
            </div>

            {/* Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Info */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Product Details */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-orange-100">
                        <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                            <Package className="w-5 h-5 text-gray-500" />
                            Order Items
                        </h2>
                        <div className="flex items-center gap-4 py-4 border-b last:border-0 border-gray-100">
                            <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">
                                <Package className="w-8 h-8" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-900">{order.productName || "Product Name"}</h3>
                                <p className="text-sm text-gray-500">Category: {order.category || "General"}</p>
                                <p className="text-sm font-medium mt-1">Qty: {order.quantity || 1} x Rs. {(order.amount / (order.quantity || 1)).toFixed(2)}</p>
                            </div>
                            <div className="ml-auto font-bold text-gray-900">
                                Rs. {order.amount.toFixed(2)}
                            </div>
                        </div>
                    </div>

                    {/* Transaction Info */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-orange-100">
                        <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                            <DollarSign className="w-5 h-5 text-gray-500" />
                            Payment Info
                        </h2>
                        <div className="flex justify-between py-2 text-gray-600">
                            <span>Subtotal</span>
                            <span>Rs. {order.amount.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between py-2 text-gray-600">
                            <span>Tax (0%)</span>
                            <span>Rs. 0.00</span>
                        </div>
                        <div className="flex justify-between py-2 border-t border-gray-100 mt-2 pt-2 text-lg font-bold text-gray-900">
                            <span>Total</span>
                            <span>Rs. {order.amount.toFixed(2)}</span>
                        </div>
                    </div>
                </div>

                {/* Sidebar Info */}
                <div className="space-y-6">
                    {/* Customer */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-orange-100">
                        <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                            <User className="w-5 h-5 text-gray-500" />
                            Customer
                        </h2>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center font-bold">
                                {order.customerName ? order.customerName.charAt(0) : 'U'}
                            </div>
                            <div>
                                <p className="font-semibold text-gray-900">{order.customerName}</p>
                                <p className="text-sm text-gray-500">Customer ID: #{Math.floor(Math.random() * 1000)}</p>
                            </div>
                        </div>
                    </div>

                    {/* Shipping Address (Mock) */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-orange-100">
                        <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                            <MapPin className="w-5 h-5 text-gray-500" />
                            Shipping Address
                        </h2>
                        <p className="text-gray-600 text-sm leading-relaxed">
                            123 Main Street,<br />
                            Colombo 03,<br />
                            Western Province,<br />
                            Sri Lanka
                        </p>
                    </div>

                    {/* Date */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-orange-100">
                        <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                            <Calendar className="w-5 h-5 text-gray-500" />
                            Timeline
                        </h2>
                        <p className="text-sm text-gray-600 mb-2">
                            <span className="font-medium">Placed on:</span> {order.date}
                        </p>
                        <p className="text-sm text-gray-600">
                            <span className="font-medium">Last Updated:</span> {order.date}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderDetails;
