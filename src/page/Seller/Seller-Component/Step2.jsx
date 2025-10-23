import React from 'react'
import { SellerInput } from './Step1'

const Step2 = () => {
  return (
    <div>
      <div>
        <div className='flex flex-col items-center'>
          <p className='text-black text-2xl mt-5' >Basic Information</p>
          <p className='text-gray-800 '>Tell us about your business or selling activities</p>
        </div>
        <div className='flex flex-col ml-12 mt-5 gap-4'>
          <SellerInput textLabel='Business Name (Optional):' type='text' name='Business Name'/>
          <div>
            <div className='flex flex-col w-[90%] gap-1'>
              <label className='text-black '>Type of Business:</label>
              <select className='border-orange-600 w-full px-4 py-1 border-2 rounded-full focus:outline-none text-black'>

              </select>
            </div>
          </div>
          <SellerInput textLabel='Business Description:' type='text' name='Business Description'/>
        </div>
        
      </div>
    </div>
  )
}

export default Step2
