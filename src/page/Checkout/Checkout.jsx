import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { cartActions } from '../../Store/ReduxSlice/cartSlice';
import { orderActions } from '../../Store/ReduxSlice/orderSlice';

const Checkout = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { cartItems, totalAmount } = useSelector((state) => state.cart);
    const [step, setStep] = useState(1); // 1: Address, 2: Payment
    const [loading, setLoading] = useState(false);

    const [address, setAddress] = useState({
        fullName: '',
        email: '',
        phone: '',
        street: '',
        city: '',
        zip: ''
    });

    const [payment, setPayment] = useState({
        cardNumber: '',
        expiryDate: '',
        cvv: '',
        cardHolder: ''
    });

    const handleAddressChange = (e) => {
        setAddress({ ...address, [e.target.name]: e.target.value });
    };

    const handlePaymentChange = (e) => {
        let value = e.target.value;
        if (e.target.name === 'cardNumber') {
            value = value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim();
        }
        if (e.target.name === 'expiryDate') {
            value = value.replace(/\D/g, '');
            if (value.length >= 2) {
                value = value.substring(0, 2) + '/' + value.substring(2, 4);
            }
        }
        setPayment({ ...payment, [e.target.name]: value });
    };

    const handlePlaceOrder = () => {
        setLoading(true);
        // Simulate API call
        setTimeout(() => {
            setLoading(false);
            dispatch(cartActions.clearCart());
            navigate('/order-success');
        }, 2000);
    };

    if (cartItems.length === 0) {
        return (
            <div className="min-h-screen pt-[120px] pb-10 flex flex-col items-center justify-center bg-gray-50">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Your cart is empty</h2>
                <button
                    onClick={() => navigate('/products')}
                    className="bg-red-500 text-white px-6 py-2 rounded-full hover:bg-red-600 transition"
                >
                    Continue Shopping
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-[120px] pb-10 bg-gray-50 font-sans">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Left Column: Forms */}
                    <div className="lg:col-span-2">

                        {/* Steps Indicator */}
                        <div className="flex items-center mb-8">
                            <div className={`flex items-center justify-center w-10 h-10 rounded-full font-bold ${step >= 1 ? 'bg-red-500 text-white' : 'bg-gray-200 text-gray-600'}`}>1</div>
                            <div className={`flex-1 h-1 mx-4 ${step >= 2 ? 'bg-red-500' : 'bg-gray-200'}`}></div>
                            <div className={`flex items-center justify-center w-10 h-10 rounded-full font-bold ${step >= 2 ? 'bg-red-500 text-white' : 'bg-gray-200 text-gray-600'}`}>2</div>
                        </div>

                        {/* Step 1: Shipping Address */}
                        {step === 1 && (
                            <div className="bg-white rounded-lg shadow-md p-6">
                                <h2 className="text-xl font-bold text-gray-800 mb-6">Shipping Information</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="col-span-2 md:col-span-1">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                        <input
                                            type="text" name="fullName" value={address.fullName} onChange={handleAddressChange}
                                            className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-red-500 focus:border-red-500 outline-none"
                                            placeholder="John Doe"
                                        />
                                    </div>
                                    <div className="col-span-2 md:col-span-1">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                                        <input
                                            type="text" name="phone" value={address.phone} onChange={handleAddressChange}
                                            className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-red-500 focus:border-red-500 outline-none"
                                            placeholder="+94 77 123 4567"
                                        />
                                    </div>
                                    <div className="col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                                        <input
                                            type="email" name="email" value={address.email} onChange={handleAddressChange}
                                            className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-red-500 focus:border-red-500 outline-none"
                                            placeholder="john@example.com"
                                        />
                                    </div>
                                    <div className="col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Street Address</label>
                                        <input
                                            type="text" name="street" value={address.street} onChange={handleAddressChange}
                                            className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-red-500 focus:border-red-500 outline-none"
                                            placeholder="123 Main St"
                                        />
                                    </div>
                                    <div className="col-span-2 md:col-span-1">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                                        <input
                                            type="text" name="city" value={address.city} onChange={handleAddressChange}
                                            className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-red-500 focus:border-red-500 outline-none"
                                            placeholder="Colombo"
                                        />
                                    </div>
                                    <div className="col-span-2 md:col-span-1">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Postal Code</label>
                                        <input
                                            type="text" name="zip" value={address.zip} onChange={handleAddressChange}
                                            className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-red-500 focus:border-red-500 outline-none"
                                            placeholder="10100"
                                        />
                                    </div>
                                </div>
                                <div className="mt-8 flex justify-end">
                                    <button
                                        onClick={() => setStep(2)}
                                        className="bg-red-500 text-white px-8 py-3 rounded-md font-semibold hover:bg-red-600 transition"
                                    >
                                        Continue to Payment
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Step 2: Payment */}
                        {step === 2 && (
                            <div className="bg-white rounded-lg shadow-md p-6">
                                <h2 className="text-xl font-bold text-gray-800 mb-6">Payment Details</h2>
                                <div className="mb-6">
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                                <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
                                                <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                        <input
                                            type="text" name="cardNumber" value={payment.cardNumber} onChange={handlePaymentChange}
                                            className="w-full border border-gray-300 rounded-md pl-10 pr-4 py-2 focus:ring-red-500 focus:border-red-500 outline-none"
                                            placeholder="Card Number" maxLength="19"
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-6 mb-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
                                        <input
                                            type="text" name="expiryDate" value={payment.expiryDate} onChange={handlePaymentChange}
                                            className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-red-500 focus:border-red-500 outline-none"
                                            placeholder="MM/YY" maxLength="5"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">CVV</label>
                                        <input
                                            type="text" name="cvv" value={payment.cvv} onChange={handlePaymentChange}
                                            className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-red-500 focus:border-red-500 outline-none"
                                            placeholder="123" maxLength="3"
                                        />
                                    </div>
                                </div>
                                <div className="mb-6">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Card Holder Name</label>
                                    <input
                                        type="text" name="cardHolder" value={payment.cardHolder} onChange={handlePaymentChange}
                                        className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-red-500 focus:border-red-500 outline-none"
                                        placeholder="Name on Card"
                                    />
                                </div>

                                <div className="mt-8 flex justify-between items-center">
                                    <button
                                        onClick={() => setStep(1)}
                                        className="text-gray-600 hover:text-gray-900 font-medium"
                                    >
                                        Back to Shipping
                                    </button>
                                    <button
                                        onClick={handlePlaceOrder}
                                        disabled={loading}
                                        className="bg-red-500 text-white px-8 py-3 rounded-md font-semibold hover:bg-red-600 transition flex items-center"
                                    >
                                        {loading ? (
                                            <span className="flex items-center">
                                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                Processing...
                                            </span>
                                        ) : (
                                            `Pay Rs. ${totalAmount.toLocaleString()}`
                                        )}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right Column: Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-lg shadow-md p-6 sticky top-28">
                            <h2 className="text-xl font-bold text-gray-800 mb-4">Order Summary</h2>
                            <div className="space-y-4 max-h-96 overflow-y-auto mb-6 pr-2">
                                {cartItems.map((item, index) => (
                                    <div key={index} className="flex gap-4 border-b border-gray-100 pb-4">
                                        <img src={item.img} alt={item.title} className="w-16 h-16 object-cover rounded-md" />
                                        <div>
                                            <h4 className="text-sm font-medium text-gray-900 line-clamp-2">{item.title}</h4>
                                            <p className="text-xs text-gray-500 mt-1">Qty: {item.quantity}</p>
                                            <p className="text-sm font-bold text-red-500 mt-1">Rs. {(item.price * item.quantity).toLocaleString()}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="border-t border-gray-200 pt-4 space-y-2">
                                <div className="flex justify-between text-gray-600">
                                    <span>Subtotal</span>
                                    <span>Rs. {totalAmount.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-gray-600">
                                    <span>Shipping</span>
                                    <span className="text-green-600">Free</span>
                                </div>
                                <div className="flex justify-between text-xl font-bold text-gray-900 pt-2 border-t mt-2">
                                    <span>Total</span>
                                    <span>Rs. {totalAmount.toLocaleString()}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Checkout;
