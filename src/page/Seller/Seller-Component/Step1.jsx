import React from 'react'

export const SellerInput = ({ textLabel, type = 'text', name, value, onChange, accept }) => {
  return (
    <div className='flex flex-col w-[90%] gap-1'>
      <label className='text-black font-medium'>
        {textLabel}
      </label>
      <input
        type={type}
        name={name}
        value={type === 'file' ? undefined : (value || '')}
        onChange={onChange}
        accept={accept}
        className={`w-full px-4 py-2 border-2 rounded-lg focus:outline-none text-black transition-all ${
          !value && value !== undefined ? 'border-gray-300 focus:border-orange-500' : 'border-green-500 focus:border-green-600'
        }`}
        autoComplete='off'
        placeholder={`Enter ${textLabel.replace(':', '').toLowerCase()}`}
      />
    </div>
  )
}

const Step1 = ({ formData, onChange }) => {
  return (
    <div>

      <div className='flex flex-col items-center gap-4'>
        <SellerInput textLabel='Full Name:' type='text' name='fullName' value={formData.fullName} onChange={onChange} />
        <SellerInput textLabel='Phone Number:' type='tel' name='phone' value={formData.phone} onChange={onChange} />
        <SellerInput textLabel='Email:' type='email' name='email' value={formData.email} onChange={onChange} />
        <SellerInput textLabel='Physical Address:' type='text' name='physicalAddress' value={formData.physicalAddress} onChange={onChange} />
      </div>
    </div>
  )
}

export default Step1