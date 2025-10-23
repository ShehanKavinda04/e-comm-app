import React from 'react'
import { SellerInput } from './Step1'

const Step3 = () => {
  return (
    <div>
        <div className='flex flex-col items-center'>
          <p className='text-black text-2xl font-medium mt-5' >Identity Verification</p>
          <p className='text-gray-800 '>Upload required documents to verify your identity</p>
        </div>
        <div className='w-[90%] border-2 border-orange-500 flex gap-3 sm:mx-9 md:mx-12 lg:mx-15 rounded-xl px-7 py-2 bg-orange-200 my-5'>
          <div className='border-2 flex justify-center items-center border-orange-500 w-[40px] h-[40px] rounded-full p-1'>
            <p className='text-orange-500 text-3xl'>!</p>
          </div>
          <div>
            <p className='text-orange-500 font-medium text-sm'>Important Note </p>
            <p className='text-orange-500 font-normal text-xs'>Only one seller account is allowed per NIC. Make sure all document are clear and readable. </p>
          </div>
        </div>
        <div className='flex flex-col items-center gap-10'>
          <SellerInput textLabel='NIC Number:' type='text' name='NIC'/>
          <Step3InputFilled title='NIC Document' description='Upload a clear scan or photo of your NIC (front end back)'/>
          <Step3InputFilled title='Proof of Address' description='Upload a recent utility bill(water,electricity) with your name and address'/>
          <Step3InputFilled title='Seller Photo' description='Upload a headshot photo for your seller profile  '/>            
        </div>          
      
    </div>
  )
}

export default Step3

const Step3InputFilled = ({ title, description }) => {
  return (
    <div className="flex flex-col items-center w-full">
      {/* title + description */}
      <div className="flex flex-col text-center sm:text-left mb-2 w-full sm:w-[90%] px-4">
        <p className="text-black font-medium text-base sm:text-lg">{title}</p>
        <p className="text-gray-600 text-sm sm:text-[15px]">{description}</p>
      </div>

      {/* upload box */}
      <div className="w-full flex flex-col items-center">
        <div className="relative w-[90%] sm:w-[80%] md:w-[85%] lg:w-[90%]">
          <input
            type="file"
            accept="image/*"
            className="w-full h-[120px] border-2 border-dashed rounded-lg border-amber-700 cursor-pointer transition-all duration-200 bg-white "
          />

          {/* center text over the input */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <p className="text-gray-700 text-sm font-medium  px-3 py-1 rounded-md">
              Click to upload or drag and drop
            </p>
            <span className="text-gray-500 text-xs mt-1">
              .PDF, .JPG, .JPEG, .PNG up to 10 MB
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};


