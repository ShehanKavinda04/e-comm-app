import React from 'react';
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const SellerRegistration = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
            <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center">
                <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                    <span className="text-3xl">🚀</span>
                </div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Become a Seller</h1>
                <p className="text-gray-600 mb-8">
                    We are excited to have you on board! The seller registration portal is currently under development and will be launching soon.
                </p>
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center justify-center gap-2 w-full py-3 bg-orange-600 text-white font-bold rounded-xl hover:bg-orange-700 transition"
                >
                    <ArrowBackIcon fontSize="small" />
                    Go Back
                </button>
            </div>
        </div>
    );
};

export default SellerRegistration;
