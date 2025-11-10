import React, { useRef, useState } from 'react'
import { SellerInput } from './Step1'

const Step2 = ({ onSubmit }) => {

  const [formData, setFormData] = useState({
    businessName: '',
    businessType: '',
    businessDescription: ''
  });

  const businessNameRef = useRef();
  const businessTypeRef = useRef();
  const businessDescriptionRef = useRef();

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormData({...formData,
      businessName: businessNameRef.current.value,
      businessType: businessTypeRef.current.value,
      businessDescription: businessDescriptionRef.current.value
    });
  };
  onSubmit(formData);

  return (
    <div>
      <div>
        <div className='flex flex-col items-center'>
          <p className='text-black text-2xl mt-5' >Basic Information</p>
          <p className='text-gray-800 '>Tell us about your business or selling activities</p>
        </div>
        <div className='flex flex-col ml-12 mt-5 gap-4'>
          <SellerInput textLabel='Business Name (Optional):' ref={businessNameRef} type='text' name='Business Name'/>
          <div>
            <div className='flex flex-col w-[90%] gap-1'>
              <label className='text-black '>Type of Business:</label>
              <select ref={businessTypeRef} className='border-orange-600 w-full px-4 py-1 border-2 rounded-full focus:outline-none text-black'>
                <option value="">Select Business Type</option>
                <option value="individual">Individual</option>
                <option value="partnership">Partnership</option>

              </select>
            </div>
          </div>
          <SellerInput textLabel='Business Description:' ref={businessDescriptionRef} type='text' name='Business Description'/>
        </div>
        <button onClick={handleSubmit} className='bg-orange-600 text-white px-4 py-2 rounded-full mt-4'>Submit</button>
      </div>
    </div>
  )
}

export default Step2
