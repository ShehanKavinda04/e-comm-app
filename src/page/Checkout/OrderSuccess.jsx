import React from 'react';
import { useNavigate } from 'react-router-dom';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

const OrderSuccess = () => {
    const navigate = useNavigate();

    return (
        <div className='min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4'>
            <div className='bg-white p-10 rounded-2xl shadow-xl text-center max-w-md w-full'>
                <div className='flex justify-center mb-6'>
                    <CheckCircleOutlineIcon sx={{ fontSize: 80, color: '#22c55e' }} />
                </div>

                <h1 className='text-3xl font-bold text-gray-900 mb-4'>Order Placed!</h1>
                <p className='text-gray-600 mb-8'>
                    Thank you for your purchase. Your order has been successfully placed and is being processed.
                </p>

                <div className='space-y-4'>
                    <button
                        onClick={() => navigate('/products')}
                        className='w-full bg-red-500 text-white py-3 rounded-lg font-semibold hover:bg-red-600 transition shadow-md'
                    >
                        Continue Shopping
                    </button>

                    <button
                        onClick={() => navigate('/')}
                        className='w-full bg-white text-gray-700 py-3 rounded-lg font-medium border border-gray-300 hover:bg-gray-50 transition'
                    >
                        Back to Home
                    </button>
                </div>
            </div>
        </div>
    );
};

export default OrderSuccess;
