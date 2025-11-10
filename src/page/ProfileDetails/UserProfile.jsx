
const UserProfile = () => {
  
  return (
    <div>
      <div className='px-5 mt-3 lg:px-30 md:px-15' >
        <div>
          <h1 className='text-3xl text-black font-semibold mb-10'>Account</h1>
          <div className='bg-white p-7 rounded shadow-md w-full h-auto flex flex-col justify-start '>
            <div className='mb-5'>
              <div className='flex flex-col items-center md:flex-row md:items-start gap-15 mx-4 my-2'>
                <div className='w-[150px] h-[150px]  rounded-full mb-5'>
                  <img src="https://wallpaperaccess.com/full/1456546.jpg" alt="profile" className='w-full h-full rounded-full' />
                  <div className=""></div>
                </div>
                <div className='flex flex-col justify-center '>
                  <p className=' text-black font-semibold text-2xl'>AYODYA SENAVIRATHNE</p>
                  <div className='flex items-center gap-2'>
                    <p className=' text-blue-800 underline mt-1 font-medium text-sm'>ayodyasenavirathne@gmail.com</p>
                    <p className=' text-gray-700 font-normal text-sm'> - Buyer </p>
                  </div>
                </div>
              </div> 
              <div className='border-t mt-5 mb-10 '>
                <div >
                  <p className='text-black font-semibold text-lg  mx-4 '>Account Details</p>
                  <div className='mt-5 mx-4 space-y-4'>
                    <p className='text-gray-700 font-semibold text-sm'>Full Name: <span className='ml-[8px]'>Ayodya Senavirathne</span></p>
                    <p className='text-gray-700 font-semibold text-sm'>Address: <span className='ml-[8px]'>No.123 Main St, Anytown, USA</span></p>
                    <p className='text-gray-700 font-semibold text-sm'>Phone: <span className='ml-[8px]'>+94712345678</span></p>
                    <p className='text-gray-700 font-semibold text-sm'>NIC: <span className='ml-[8px]'>123456</span></p>
                    <p className='text-gray-700 font-semibold text-sm'>Role: <span className='ml-[8px]'>Buyer</span></p>
                    <p className='text-gray-700 font-semibold text-sm'>Email: <span className='ml-[8px]'>ayodyasenavirathne@gmail.com</span></p>
                  </div>
                </div>
              </div>
              <div className=' mt-15 pt-5 grid grid-cols-1 md:grid-cols-2 gap-10 justify-between'>
                <div className='space-y-2'>
                  <p className='text-black font-semibold text-lg  mx-4 '>Account Details</p>
                  <p className='text-black font-normal text-[14px]  mx-4 '>Display Name: <span className='ml-[8px]'>Ayodya_0452</span></p>
                  <p className='text-black font-normal text-[14px] mx-4 '>Account Created: <span className='ml-[8px]'>2025-05-12</span></p>
                  <p className='text-black font-normal text-[14px] mx-4 '>Account Verification: <span className='ml-[8px] text-green-00'>verified</span></p>
                  <p className='text-black font-normal text-[14px] mx-4 '>Member Ship: <span className='ml-[8px] text-orange-600'>Gold Member</span></p>
                </div>
                <div className='space-y-2'>
                  <p className='text-black font-semibold text-lg  mx-4 '>Security Settings</p>
                  <p className='text-black font-normal text-[14px]  mx-4 '>Two Factor Authentication: <span className='ml-[8px] text-blue-700'>Enabled</span></p>
                  <p className='text-black font-normal text-[14px]  mx-4 '>Security Question Set: <span className='ml-[8px]'>Yes</span></p>
                  <p className='text-black font-normal text-[14px]  mx-4 '>Login Notification: <span className='ml-[8px] text-blue-700'>Enabled</span></p>
                  <p className='text-black font-normal text-[14px]  mx-4 '>Connected Devices: <span className='ml-[8px]'>2 Devices</span></p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserProfile