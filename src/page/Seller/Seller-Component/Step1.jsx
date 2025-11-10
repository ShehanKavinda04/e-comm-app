import React, { forwardRef, useRef, useState } from 'react'

const Step1 = ({ onSubmit }) => {

  const [formData, setFormData] = useState({
    fullName: '',
    phoneNumber: '',
    email: '',
    physicalAddress: ''
  });

  const fullNameRef = useRef();
  const phoneNumberRef = useRef();
  const emailRef = useRef();
  const physicalAddressRef = useRef();

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormData({...formData,
      fullName: fullNameRef.current.value,
      phoneNumber: phoneNumberRef.current.value,
      email: emailRef.current.value,
      physicalAddress: physicalAddressRef.current.value
    });
  };

  onSubmit(formData);
 
  // You can also pass formData to the parent component or handle it as needed

  return (
    <div >
      <div className='flex flex-col items-center'>
        <p className='text-black text-2xl mt-5' >Basic Information</p>
        <p className='text-gray-800 '>Please provide your personal contact details</p>
      </div>
      <div className='flex flex-col items-center gap-4'>
        <SellerInput textLabel='Full Name:' ref={fullNameRef} type='text' name='Full Name'/>
        <SellerInput textLabel='Phone Number:' ref={phoneNumberRef} type='text' name='Phone number'/>
        <SellerInput textLabel='E mail:' ref={emailRef} type='email' name='E mail'/>
        <SellerInput textLabel='Physical Address:' ref={physicalAddressRef} type='text' name='Physical Address'/>
      </div>
      <button onClick={handleSubmit} className='bg-orange-600 text-white px-4 py-2 rounded-full mt-4'>Submit</button>
    </div>
  )
}

export default Step1

export const SellerInput = forwardRef(({textLabel, type, name}, ref) => {
  return(
    <div className='flex flex-col w-[90%] gap-1'>
      <label className='text-black '>
        {textLabel}
      </label>
      <input type={type} ref={ref} name={name} className='border-orange-600 w-full px-4 py-1 border-2 rounded-full focus:outline-none text-black' />    
    </div>
  )
})