import React from 'react';

const CartSummary = ({ subtotal, handleProceedToCheckout, isEmpty }) => {
  return (
    <div className="bg-white mt-6 rounded-t-2xl shadow-md">
      <div className="px-6 py-5 border-b border-gray-200">
        <div className="flex justify-between items-center mb-3">
          <span className="text-gray-600">Subtotal</span>
          <span className="font-semibold">Rs. {subtotal.toLocaleString()}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Shipping</span>
          <span className="font-semibold text-green-600">Free</span>
        </div>
      </div>

      <div className="px-6 py-5 flex justify-between items-center">
        <span className="text-xl font-bold text-black">Total</span>
        <span className="text-xl font-bold text-black">
          Rs. {subtotal.toLocaleString()}
        </span>
      </div>

      <div className="px-6 pb-6">
        <button
          onClick={handleProceedToCheckout}
          disabled={isEmpty}
          className={`w-full text-white font-semibold py-3.5 rounded-xl transition duration-200 text-lg shadow-lg ${
            isEmpty ? 'bg-gray-400 cursor-not-allowed' : 'bg-orange-600 hover:bg-orange-700'
          }`}
        >
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
};

export default CartSummary;