import React from 'react'

const Forgatepass1 = () => {
  return (    
    <div className='flex justify-center mt-10'>
      <div className='flex flex-col gap-12 bg-white px-5 w-[55%] rounded-xl'>
        <p className='text-black text-4xl font-medium mt-5'>Sign In</p>
        <div className='flex gap-5 flex-col items-center justify-center'>
          <div className='flex flex-col w-[90%] gap-4'>
            <label className='text-black '>
              New password:        
            </label>
            <input type='password' name='password' className='border-orange-600 w-full px-4 py-1 border-2 rounded-full focus:outline-none text-black' />    
          </div>
          <div className='flex flex-col w-[90%] gap-4'>
            <label className='text-black '>
              Conform Password:        
            </label>
            <input type='password' name='password' className='border-orange-600 w-full px-4 py-1 border-2 rounded-full focus:outline-none text-black' />    
          </div>
          <button className='bg-orange-700 w-[40%] px-5 py-1 mb-45'>Conform</button>
        </div>
      </div>
    </div>
  )
}

export default Forgatepass1