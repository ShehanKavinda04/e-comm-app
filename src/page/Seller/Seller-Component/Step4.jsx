import React from 'react'
import { SellerInput } from './Step1'

const Step4 = () => {
  return (
    <div>
      <div>
        <div className='flex flex-col items-center'>
          <p className='text-black text-2xl font-medium mt-5' >Financial Information</p>
          <p className='text-gray-800 '>Please provide your personal contact details</p>
        </div>
        <div className='w-[90%] border-2 border-blue-700 flex gap-3 sm:mx-9 md:mx-12 lg:mx-15 rounded-xl px-7 py-2 bg-blue-200 my-5'>
          <div className='border-2 flex justify-center items-center border-blue-700 w-[40px] h-[40px] rounded-full p-1'>
            <p className='text-blue-700 text-3xl'>!</p>
          </div>
          <div>
            <p className='text-blue-700 font-medium text-sm'>Security Note</p>
            <p className='text-blue-700 font-normal text-xs'>Your financial information is encrypted and secure. Account holder name must match your full name. </p>
          </div>
        </div>
        <div className='flex flex-col items-center gap-4'>
          <SellerInput textLabel='Bank Name:' type='text' name='Bank Name'/>
          <SellerInput textLabel='Account Holder Name:' type='text' name='Holder Name'/>
          <SellerInput textLabel='Bank Account Number:' type='text' name='Account Number'/>
          <SellerInput textLabel='Branch Name:' type='text' name='Branch Name'/>
        </div>

      </div>
    </div>
  )
}

export default Step4

