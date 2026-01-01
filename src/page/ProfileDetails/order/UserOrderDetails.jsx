import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Loader2, ShoppingBag, MapPin, CreditCard, Truck, ArrowLeft } from 'lucide-react';
import { formatDate, getStatusBadge, getTrackingUrl, generateStatusSummary } from './utils';

import { getAllOrders } from '../../../Services/MockDataService'; // Import Data Service

const UserOrderDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const reduxOrders = useSelector(state => state.order.orders);
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Try finding in Redux first
        let foundOrder = reduxOrders.find(o => o.id === id);

        // If not in Redux, check Mock Data services (for direct link / fresh reload)
        if (!foundOrder) {
            const allMockOrders = getAllOrders();
            foundOrder = allMockOrders.find(o => o.id === id);
        }

        if (foundOrder) {
            setOrder(foundOrder);
        }
        // Logic: even if not found, we stop loading to show "Order Not Found"
        setLoading(false);
    }, [id, reduxOrders]);

    if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin text-orange-600" size={48} /></div>;
    if (!order) return <div className="min-h-screen flex items-center justify-center text-xl text-gray-600">Order Not Found</div>;

    const trackingUrl = getTrackingUrl(order.tracking, order.trackingProvider);
    const statusSummary = generateStatusSummary(order);

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-600 hover:text-orange-600 mb-6 transition">
                    <ArrowLeft size={20} /> Back to Orders
                </button>

                <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                    <div className="bg-white border-b px-8 py-6 flex items-center justify-between">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900">Order #{order.id}</h2>
                            <p className="text-sm text-gray-600 mt-1">Placed on {formatDate(order.date)}</p>
                        </div>
                        {/* Status Badge */}
                        <div>{getStatusBadge(order.status)}</div>
                    </div>

                    <div className="p-8 space-y-8">
                        {/* AI Status Summary */}
                        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-200">
                            <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                                <Loader2 size={20} className="text-blue-600" />
                                Latest Updates
                            </h3>
                            <p className="text-gray-800 leading-relaxed">{statusSummary}</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Shipping Address */}
                            <div>
                                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-gray-800">
                                    <MapPin size={20} className="text-orange-600" />
                                    Shipping Address
                                </h3>
                                <div className="bg-gray-50 p-4 rounded-xl text-gray-700 leading-relaxed border border-gray-100 h-full">
                                    {order.shippingAddress}
                                </div>
                            </div>
                            {/* Items */}
                            <div>
                                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-gray-800">
                                    <ShoppingBag size={20} className="text-orange-600" />
                                    Items ({order.items.length})
                                </h3>
                                <div className="space-y-4">
                                    {order.items.map((item, idx) => (
                                        <div key={idx} className="flex gap-4 p-3 bg-gray-50 rounded-xl border border-gray-100">
                                            <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-200 flex-shrink-0">
                                                <img
                                                    src={item.image}
                                                    alt={item.name}
                                                    className="w-full h-full object-cover"
                                                    onError={(e) => (e.target.src = 'https://via.placeholder.com/150?text=No+Image')}
                                                />
                                            </div>
                                            <div className="flex-1">
                                                <p className="font-semibold text-sm line-clamp-1">{item.name}</p>
                                                <div className="flex justify-between items-center mt-1">
                                                    <p className="text-xs text-gray-600">Qty: {item.qty}</p>
                                                    <p className="font-bold text-sm">Rs. {item.price.toLocaleString()}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Payment Summary */}
                        <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-gray-800">
                                <CreditCard size={20} className="text-orange-600" />
                                Payment Summary
                            </h3>
                            <div className="space-y-3">
                                <div className="flex justify-between text-gray-600">
                                    <span>Subtotal</span>
                                    <span>Rs. {(order.total - 1000).toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-gray-600">
                                    <span>Shipping</span>
                                    <span>Rs. 500</span>
                                </div>
                                <div className="flex justify-between text-gray-600">
                                    <span>Taxes</span>
                                    <span>Rs. 500</span>
                                </div>
                                <div className="border-t pt-3 flex justify-between font-bold text-lg text-gray-900">
                                    <span>Total</span>
                                    <span>Rs. {order.total.toLocaleString()}</span>
                                </div>
                            </div>
                            <p className="text-xs text-gray-500 mt-4 text-center uppercase tracking-wide">Paid via {order.paymentMethod}</p>
                        </div>

                        {/* Track Order Button */}
                        {trackingUrl && (
                            <div className="text-center pt-4">
                                <a
                                    href={trackingUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 px-8 py-4 bg-orange-600 text-white font-medium rounded-xl hover:bg-orange-700 transition shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                                >
                                    <Truck size={20} />
                                    Track Shipment Live
                                </a>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserOrderDetails;
