import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Package, User, Calendar, DollarSign, MapPin } from 'lucide-react';
import api from '../../../../Services/api';

const OrderDetails = () => {
    const { id: rawId } = useParams();
    // Strip prefix for API call if it's ORD-1024 format
    const id = rawId.replace("ORD-", "");
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchOrderDetails = async () => {
            if (!id || isNaN(parseInt(id))) {
                console.error("Invalid order ID provided to OrderDetails:", id);
                setIsLoading(false);
                return;
            }

            try {
                // Using numeric ID for direct backend retrieval
                const response = await api.get(`/orders/${id}`);
                const data = response.data;
                
                // Map backend DTO to UI component
                const mappedOrder = {
                    id: data.orderNumber || `ORD-${data.orderId}`,
                    customerName: (data.items && data.items.length > 0) ? data.items[0].customerName : "Customer",
                    date: data.orderedAt ? new Date(data.orderedAt).toLocaleString() : "N/A",
                    amount: data.totalAmount || 0,
                    status: (data.items && data.items.length > 0) ? data.items[0].status : (data.paymentStatus || "Pending"),
                    paymentMethod: data.paymentMethod || "N/A",
                    shippingAddress: data.shippingAddress || "N/A",
                    items: data.items || []
                };
                setOrder(mappedOrder);
            } catch (error) {
                console.error("Error fetching order details:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchOrderDetails();

        // SSE Real-time Synchronization
        const sseUrl = "http://localhost:8082/api/ads/stream";
        const eventSource = new EventSource(sseUrl);

        eventSource.addEventListener("DASHBOARD_UPDATE", (event) => {
            console.log("Admin Order Details: Real-time update via SSE");
            fetchOrderDetails();
        });

        eventSource.onerror = (err) => {
            console.error("SSE Connection Error for Admin Order Details:", err);
            eventSource.close();
        };

        return () => {
            if (eventSource) eventSource.close();
        };
    }, [id]);

    if (isLoading) {
        return (
            <div className="p-6 bg-gray-50 min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
            </div>
        );
    }

    if (!order) {
        return (
            <div className="p-6 bg-gray-50 min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Order Not Found</h2>
                    <button
                        onClick={() => navigate('/admin')}
                        className="text-blue-600 hover:underline"
                    >
                        Return to Dashboard
                    </button>
                </div>
            </div>
        );
    }

    const getStatusColor = (status) => {
        const s = status?.toLowerCase() || "";
        if (s.includes("pending") || s.includes("processing")) return 'bg-[#fadcb6] text-[#eca609]';
        if (s.includes("delivered") || s.includes("resolved")) return 'bg-green-100 text-green-600';
        if (s.includes("shipped")) return 'bg-blue-100 text-blue-600';
        if (s.includes("canceled") || s.includes("disputed")) return 'bg-pink-100 text-pink-600';
        return 'bg-gray-100 text-gray-600';
    };

    return (
        <div className="p-6 bg-gray-50 min-h-screen font-sans">
            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
                <button
                    onClick={() => navigate('/admin')}
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
                        <div className="space-y-4">
                            {order.items.map((item, index) => (
                                <div key={index} className="flex items-center gap-4 py-4 border-b last:border-0 border-gray-100">
                                    <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400 overflow-hidden">
                                        {item.productImage ? (
                                            <img src={item.productImage} alt={item.productName} className="w-full h-full object-cover" />
                                        ) : (
                                            <Package className="w-8 h-8" />
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-gray-900">{item.productName}</h3>
                                        <p className="text-sm text-gray-500">Seller: {item.sellerName}</p>
                                        <p className="text-sm font-medium mt-1">Qty: {item.quantity} x Rs. {item.unitPrice?.toFixed(2)}</p>
                                    </div>
                                    <div className="text-right">
                                        <div className="font-bold text-gray-900">
                                            Rs. {item.subtotal?.toFixed(2)}
                                        </div>
                                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${getStatusColor(item.status)}`}>
                                            {item.status}
                                        </span>
                                    </div>
                                </div>
                            ))}
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
                            <span>Payment Method</span>
                            <span className="font-medium">{order.paymentMethod}</span>
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
                                <p className="text-sm text-gray-500">Authorized Access Only</p>
                            </div>
                        </div>
                    </div>

                    {/* Shipping Address */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-orange-100">
                        <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                            <MapPin className="w-5 h-5 text-gray-500" />
                            Shipping Address
                        </h2>
                        <p className="text-gray-600 text-sm leading-relaxed">
                            {order.shippingAddress}
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
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderDetails;
