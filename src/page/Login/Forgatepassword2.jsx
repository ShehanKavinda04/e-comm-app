import React from 'react'

const Forgatepassword2 = () => {
  return (
    <div className='flex justify-center mt-10'>
      <div className='bg-white w-[55%] rounded-xl'>
        <div className='flex flex-col gap-14 mx-8'>
          <p className='text-black text-3xl font-bold mt-5'>Forgot Password</p>
          <div className='flex flex-col items-center gap-9 '>
            <div className='flex flex-col w-[90%] gap-4 '>
              <label className='text-black '>
                Email:        
              </label>
              <input type='password' name='password' className='border-orange-600 w-full px-4 py-1 border-2 rounded-full focus:outline-none text-black' />    
            </div>
            <button className='bg-orange-600 w-[65%] px-5 py-0.5 mb-45'>Request OTP</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Forgatepassword2