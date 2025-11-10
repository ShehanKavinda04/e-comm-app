import React, { useState } from 'react';

const Toggle1 = ({ defaultChecked = true, onChange = () => {} }) => {
  // Initialize state based on the prop
  const [checked, setChecked] = useState(defaultChecked);

  // Simplified handler
  const handleChange = (e) => {
    const nextChecked = e.target.checked;
    setChecked(nextChecked);
    onChange(nextChecked); // Call the external handler
  };

  return (
    <label className="inline-flex items-center cursor-pointer">
      {/* 1. The Actual Checkbox (Hidden) */}
      <input
        type="checkbox"
        className="peer hidden"
        checked={checked}
        onChange={handleChange}
        
      />

      {/* 2. The Visual Toggle Track/Background */}
      <div
        className={`
          relative w-11 h-6 rounded-full transition-colors 
          ${checked ? 'bg-red-600' : 'bg-gray-300'}
        `}
      >
        {/* 3. The Visual Toggle Knob/Circle */}
        <div
          className={`
            absolute top-0.5 left-[2px] h-5 w-5 bg-white rounded-full shadow transition-transform 
            ${checked ? 'translate-x-[1.35rem]' : 'translate-x-0'}
          `}
        />
      </div>
    </label>
  );
};

export default Toggle1;

// ...existing code...