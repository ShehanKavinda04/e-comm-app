import React from 'react';

const InputField = ({
  label,
  placeholder,
  refProp,
  error,
  required = false,
  type = 'text',
  inputMode,
  pattern,
  maxLength,
}) => (
  <div className="space-y-1">
    <label className="block text-sm font-medium text-gray-800 sm:text-base">
      {label} {required && <span className="text-red-600">*</span>}
    </label>
    <input
      type={type}
      ref={refProp}
      placeholder={placeholder}
      inputMode={inputMode}
      pattern={pattern}
      maxLength={maxLength}
      className={`w-full rounded-full border-2 px-4 py-3 text-gray-700 transition-colors focus:outline-none sm:py-3.5 ${
        error
          ? 'border-red-500 focus:border-red-600'
          : 'border-orange-700 focus:border-orange-500'
      }`}
    />
    {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
  </div>
);

export default InputField;