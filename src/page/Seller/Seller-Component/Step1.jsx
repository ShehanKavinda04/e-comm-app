import React from 'react'

export const SellerInput = ({ textLabel, type = 'text', name, value, onChange, accept }) => {
  return (
    <div className='flex flex-col w-[90%] gap-1'>
      <label className='text-black '>
        {textLabel}
      </label>
      <input
        type={type}
        name={name}
        value={type === 'file' ? undefined : value}
        onChange={onChange}
        accept={accept}
        className='border-orange-600 w-full px-4 py-1 border-2 rounded-full focus:outline-none text-black'
        autoComplete='off'
      />
    </div>
  )
}

const Step1 = ({ formData, onChange }) => {
  return (
    <div>
      <div className='flex flex-col items-center'>
        <p className='text-black text-2xl mt-5' >Basic Information</p>
        <p className='text-gray-800 '>Please provide your personal contact details</p>
      </div>

      <div className='flex flex-col items-center gap-4'>
        <SellerInput textLabel='Full Name:' type='text' name='fullName' value={formData.fullName} onChange={onChange} />
        <SellerInput textLabel='Phone Number:' type='tel' name='phoneNumber' value={formData.phoneNumber} onChange={onChange} />
        <SellerInput textLabel='Email:' type='email' name='email' value={formData.email} onChange={onChange} />
        <SellerInput textLabel='Physical Address:' type='text' name='physicalAddress' value={formData.physicalAddress} onChange={onChange} />
      </div>
    </div>
  )
}

export default Step1