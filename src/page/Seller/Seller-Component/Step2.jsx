import React from 'react'
import { SellerInput } from './Step1'

const Step2 = ({ formData, onChange }) => {
  return (
    <div>
      <div>

        <div className='flex flex-col ml-12 mt-5 gap-4'>
          <SellerInput textLabel='Business Name (Optional):' type='text' name='businessName' value={formData.businessName} onChange={onChange} />

          <div className='flex flex-col w-[90%] gap-1'>
            <label className='text-black font-medium'>Type of Business:</label>
            <select
              name='businessType'
              value={formData.businessType}
              onChange={onChange}
              className='border-2 border-gray-300 w-full px-4 py-2 rounded-lg focus:outline-none focus:border-orange-500 text-black appearance-none bg-white transition-all shadow-sm'
            >
              <option value=''>Select Business Type</option>
              <option value='INDIVIDUAL'>Individual</option>
              <option value='SOLE_PROPRIETOR'>Sole Proprietor</option>
              <option value='PARTNERSHIP'>Partnership</option>
              <option value='PRIVATE_COMPANY'>Private Company</option>
              <option value='PUBLIC_COMPANY'>Public Company</option>
              <option value='OTHER'>Other</option>
            </select>
          </div>

          <div className='flex flex-col w-[90%] gap-1'>
            <label className='text-black font-medium'>Business Description:</label>
            <textarea
              name='businessDescription'
              value={formData.businessDescription}
              onChange={onChange}
              rows='4'
              className='w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-orange-500 text-black transition-all shadow-sm'
              placeholder="Tell us about what you plan to sell and your business background..."
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Step2