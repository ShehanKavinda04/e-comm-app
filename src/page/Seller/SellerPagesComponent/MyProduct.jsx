import React from 'react'
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import BorderColorIcon from '@mui/icons-material/BorderColor';

const MyProduct = () => {
  return (
    <div>
      <div>
      <div className='flex justify-between mx-4 lg:px-50 md:px-15'>
        <p className='text-black text-2xl font-semibold '>My Orders</p>
        <div className='flex gap-3'>
          <button className='text-black border-2 rounded-full px-6 py-1 cursor-pointer'>All</button>
          <button className='text-black border-2 rounded-full px-6 py-1 cursor-pointer'>Processing</button>
          <button className='text-black border-2 rounded-full px-6 py-1 cursor-pointer'>Delivered</button>
          <button className='text-black border-2 rounded-full px-6 py-1 cursor-pointer'>Shipped</button>
        </div>
      </div>
      <div className='lg:px-30 md:px-15'>
        <div className='bg-gray-100 m-5 border-2 border-orange-700 space-y-5 rounded-2xl px-5 py-8'>
          <OrderItemCard/>
          <OrderItemCard/>
          <OrderItemCard/>
    
        </div>
      </div>
    </div>
      
    </div>
  )
}

export default MyProduct

const OrderItemCard = ()=>{
  return(
    <div className='border-2 border-orange-700 rounded-md p-3  '>
      <div className='flex items-center'>
        <div className='flex items-center gap-5'>
          <div className='w-[15%] border rounded-2xl'>
            <img src="https://klec.jayagrocer.com/cdn/shop/files/034432-1-1.jpg?v=1749895748" alt="item1" className='w-full object-cover rounded-2xl'/>
          </div>
          <div className='flex flex-col gap-5 justify-between '>
            <div>
              <p className='text-black text-[15px]'>iPhone 13 Display</p>
              <p className='text-black text-xl font-bold' >Rs.25000</p>              
            </div>
            <div className='flex gap-2'>
              <p className='text-[11px] text-gray-600' >stock: 25</p>
              <p className='text-[11px] text-gray-600' >Sold: 156</p>
              <div className='bg-green-400 flex justify-center w-[45%] rounded-full'>
                <p className='text-[11px] text-gray-600' >Active</p>
              </div>
            </div> 
          </div>
        </div>
        <div className='flex flex-col gap-1'>
          <div className=' border items-center border-black flex px-3 py-0.5 rounded cursor-pointer'>
            <BorderColorIcon sx={{
              color:"black",
              fontSize: 20 
            }}/>
            <p className='text-black text-[16px]'>Edit</p>
          </div>
          <div className='border items-center border-black flex px-3 py-0.5 rounded cursor-pointer'>
            <VisibilityIcon sx={{
              color:"black",
              fontSize: 20 
            }}/>
            <p className='text-black text-[16px]'>View</p>
          </div>
          <div className=' border items-center border-black flex px-3 py-0.5 rounded cursor-pointer'>
            <DeleteIcon sx={{
              color:"black",
              fontSize: 20 
            }}/>
            <p className='text-red-600 text-[16px]'>Delete</p>
          </div>
        </div>
      </div>
      
      
    </div>
  )
}