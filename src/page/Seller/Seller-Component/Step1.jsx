import React from 'react'

const Step1 = () => {
  
  return (
    <div >
      <div className='flex flex-col items-center'>
        <p className='text-black text-2xl mt-5' >Basic Information</p>
        <p className='text-gray-800 '>Please provide your personal contact details</p>
      </div>
      <div className='flex flex-col items-center gap-4'>
        <SellerInput textLabel='Full Name:' type='text' name='Full Name'/>
        <SellerInput textLabel='Phone Number:' type='text' name='Phone number'/>
        <SellerInput textLabel='E mail:' type='email' name='E mail'/>
        <SellerInput textLabel='Physical Address:' type='text' name='Physical Address'/>
      </div>
    </div>
  )
}

export default Step1

export const SellerInput =({textLabel, type, name})=>{
  return(
    <div className='flex flex-col w-[90%] gap-1'>
      <label className='text-black '>
        {textLabel}
      </label>
      <input type={type} name={name} className='border-orange-600 w-full px-4 py-1 border-2 rounded-full focus:outline-none text-black' />    
    </div>
  )
}