import React from 'react'
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';


const Orders = () => {
  return (
    <div>
      <div>
        <div className='flex justify-between mx-4 lg:px-50 md:px-15'>
          <p className='text-black text-2xl font-semibold '>Order Management</p>
          <div className='flex gap-3'>
            <button className='text-black border-2 rounded-full px-6 py-1 cursor-pointer'>All</button>
            <button className='text-black border-2 rounded-full px-6 py-1 cursor-pointer'>Processing</button>
            <button className='text-black border-2 rounded-full px-6 py-1 cursor-pointer'>Delivered</button>
            <button className='text-black border-2 rounded-full px-6 py-1 cursor-pointer'>Shipped</button>
          </div>
        </div>
        <div className='lg:px-30 md:px-15'>
          <div className='bg-gray-200 m-5  space-y-5 rounded-2xl px-5 py-8'>
            <p className='text-black text-2xl'>Recent Orders</p>
            <OrderItemCard/>
            <OrderItemCard/>
            <OrderItemCard/>
      
          </div>
      </div>
    </div>
    </div>
  )
}

export default Orders

const OrderItemCard = ()=>{
  return(
    <div className='border-2 border-orange-400 rounded-md p-3  '>
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-5'>
          <div>
            <p className='text-black font-bold' >#ORD_123</p>
            <p className='text-[11px] text-gray-600' >Ordered on 2025-01-01</p>
            <p className='text-black text-[12px]'>iPhone 13 Display</p>
          </div>
        </div>
        <div className='flex gap-15 items-center'>
          <div>
          <p className='text-black font-bold ml-2'>Rs.25000</p>
          <div className='text-black text-sm bg-blue-400 w-[80px] px-3 rounded-full py-0.5'>Shipping</div>
          </div>
          <div className='flex gap-4'>
            <div className='border border-black px-2 py-0.5 h-[35px] w-[35px] rounded justify-center cursor-pointer'>
              <RemoveRedEyeIcon sx={{
                color:'black',
                fontSize:17
              }}/>
            </div>
            <div className='border border-black px-2 py-0.5 rounded h-[35px] w-[35px] justify-center cursor-pointer'>
              <LocalShippingIcon sx={{
                color:'black',
                fontSize:17
              }}/>
            </div>
          </div>
        </div>
      </div>
      
    </div>
  )
}