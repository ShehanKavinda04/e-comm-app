import React from 'react'

const OTPPage = () => {
  return (
    <div className='flex justify-center'>
      <div className='flex flex-col justify-center items-center gap-8 bg-white rounded-xl w-[45%]'>
        <div>
          <p className='text-black text-4xl font-medium mt-8'>OTP Verification</p>
        </div>
        <div className='flex flex-col items-center'>
          <p className='text-black '>One time password (OTP) has been sent </p>
          <div>
            <p className='text-black'>via Email to <span className='font-medium'> example@gmail.com </span></p>
          </div>
        </div>
        <div>
          <p className='text-black font-semibold'>Enter the OPT below to verify it.</p>
        </div>
        <div className='flex gap-4'>
          <input className='border w-11 h-11 px-3 text-3xl text-black border-black focus:outline-none' type="text" />
          <input className='border border-black focus:outline-none w-11 h-11 px-3 text-3xl text-black' type="text" />
          <input className='border border-black focus:outline-none w-11 h-11 px-3 text-3xl text-black' type="text" />
          <input className='border border-black focus:outline-none w-11 h-11 px-3 text-3xl text-black' type="text" />
          <input className='border border-black focus:outline-none w-11 h-11 px-3 text-3xl text-black' type="text" />
        </div>
        <button className='bg-black mt-3 px-11 py-2 mb-10'>Verify</button>
      </div>
    </div>
  )
}

export default OTPPage