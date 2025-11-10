import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import Toggle1 from '../../../component/Toggle1';

const StoreSetting = () => {
  return (
    <div className='flex flex-col gap-5 mb-10'>
      <div>
        <p className='text-black text-2xl mx-7'>General Information</p>
      </div>
      {/*--------------General Information component---------------- */}
      <div className='flex flex-col gap-4 bg-gray-100 mx-10 p-7 rounded-xl'>
        <div className='flex flex-col gap-1'>
          <label htmlFor="Store Name" className='text-black font-medium'>Store Name</label>
          <input type="text" placeholder="ABC Center" name="Store Name" id="Store Name" className=' border rounded focus:outline-none px-3 py-1 border-gray-400 text-black font-medium'/>
        </div>
        <div className='flex flex-col gap-1'>
          <label htmlFor="Email" className='text-black font-medium'>Contact Email</label>
          <input type="email" placeholder="abccenter@gmail.com" name="email" id="email" className=' border rounded focus:outline-none px-3 py-1 border-gray-400 text-black font-medium'/>
        </div>
        <div className='flex flex-col gap-1'>
          <label htmlFor="Phone number" className='text-black font-medium'>Phone Number</label>
          <input type="number" placeholder="+94xxxxxxxxx" name="Phone number" id="Phone number" className='border rounded focus:outline-none px-3 py-1 border-gray-400 text-black font-medium'/>
        </div>
      </div>
      {/*--------------Appearance component---------------- */}
      <div>
        <p className='text-black text-2xl mx-7'>Appearance</p>
      </div>
      <div className='bg-gray-100 p-8 gap-5 mx-10 rounded-xl'>
        <div className='flex gap-10'>
          <div className='bg-gray-400 w-20 h-20 rounded-full'>
          </div>
          <div className='flex flex-col gap-1'>
            <p className='text-black font-medium'>Store Logo</p>
            <p className='text-blue-800 font-medium text-sm'>Change Logo</p>
          </div>
        </div>
        <div className='bg-gray-500 h-0.5 w-full my-5' />
        <p className='text-black font-medium mb-4'>
          Store Banner
        </p>
        <div>
          <div className='bg-gray-400 h-[200px] w-full rounded-xl'>

          </div>
        </div>
      </div>
      {/*--------------Payment Settings component---------------- */}
      <div className='mx-9'>
        <p className='text-black text-2xl font-semibold'>Payment Settings</p>
      </div>
      <div className='bg-gray-100 p-7 mx-10 rounded-2xl' >
        <div className='flex flex-col gap-4 '>
          <div className='flex justify-between cursor-pointer hover:opacity-70 transition-all duration-75 hover:scale-105'>
            <p className='text-black font-medium'>
              Payment Methods
            </p>
            <div>
              <ArrowForwardIosIcon sx={{
                color:"black",
                fontSize: 14
              }}/>
            </div>
          </div>
          <div className='bg-gray-400 w-full h-0.5'  />
          <div className='flex justify-between cursor-pointer hover:opacity-70 transition-all duration-75 hover:scale-105'>
            <p className='text-black font-medium'>
              Transaction History
            </p>
            <div>
              <ArrowForwardIosIcon sx={{
                color:"black",
                fontSize: 14
              }}/>
            </div>
          </div>          
        </div>
      </div>

      {/*--------------Notification Settings component---------------- */}
      <div className='mx-9'>
        <p className='text-black text-2xl font-semibold'>Notification Settings</p>
      </div>
      <div className='bg-gray-100 p-7 mx-10 rounded-2xl' >
        <div className='flex flex-col gap-4 '>
          <div className='flex justify-between'>
            <p className='text-black font-medium'>
              New Orders
            </p>
            <div>
              <Toggle1/>
            </div>
          </div>
          <div className='bg-gray-400 w-full h-0.5'  />
          <div className='flex justify-between'>
            <p className='text-black font-medium'>
              New Massage
            </p>
            <div>
              <Toggle1/>
            </div>
          </div> 
          <div className='bg-gray-400 w-full h-0.5'  />         
          <div className='flex justify-between '>
            <p className='text-black font-medium'>
              Low stock Alerts
            </p>
            <div>
              <Toggle1/>
            </div>
          </div>          
        </div>
      </div>

      {/*--------------Policies component---------------- */}
      <div className='mx-9'>
        <p className='text-black text-2xl font-semibold'>Policies</p>
      </div>
      <div className='bg-gray-100 p-7 mx-10 rounded-2xl' >
        <div className='flex flex-col gap-4 '>
          <div className='flex justify-between cursor-pointer hover:opacity-70 transition-all duration-75 hover:scale-105'>
            <p className='text-black font-medium'>
              Shipping Policy
            </p>
            <div>
              <ArrowForwardIosIcon sx={{
                color:"black",
                fontSize: 14
              }}/>
            </div>
          </div>
          <div className='bg-gray-400 w-full h-0.5'  />
          <div className='flex justify-between cursor-pointer hover:opacity-70 transition-all duration-75 hover:scale-105'>
            <p className='text-black font-medium'>
              Return Police
            </p>
            <div>
              <ArrowForwardIosIcon sx={{
                color:"black",
                fontSize: 14
              }}/>
            </div>
          </div> 
          <div className='bg-gray-400 w-full h-0.5'  />         
          <div className='flex justify-between cursor-pointer hover:opacity-70 transition-all duration-75 hover:scale-105'>
            <p className='text-black font-medium'>
              Privacy Policy
            </p>
            <div>
              <ArrowForwardIosIcon sx={{
                color:"black",
                fontSize: 14
              }}/>
            </div>
          </div>          
        </div>
      </div>
    </div>
  )
}

export default StoreSetting