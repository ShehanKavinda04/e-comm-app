import React from 'react';

const FormButton = ({ children, disabled = false }) => (
  <button
    type="submit"
    disabled={disabled}
    className="w-full rounded-full bg-orange-600 px-6 py-4 text-lg font-medium text-white shadow-md transition hover:bg-orange-700 focus:outline-none focus:ring-4 focus:ring-orange-300 disabled:cursor-not-allowed disabled:bg-gray-400"
  >
    {children}
  </button>
);

export default FormButton;