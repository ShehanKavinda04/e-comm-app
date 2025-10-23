import React from 'react'

const MyOrder = () => {
  return (
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
  )
}

export default MyOrder

const OrderItemCard = ()=>{
  return(
    <div className='border-2 border-orange-700 rounded-md p-3  '>
      <div className='flex items-center'>
        <div className='flex items-center gap-5'>
          <div className='w-[15%] border rounded-2xl'>
            <img src="https://klec.jayagrocer.com/cdn/shop/files/034432-1-1.jpg?v=1749895748" alt="item1" className='w-full object-cover rounded-2xl'/>
          </div>
          <div>
            <p className='text-black font-bold' >#ORD_123</p>
            <p className='text-[11px] text-gray-600' >Ordered on 2025-01-01</p>
            <p className='text-black text-[12px]'>iPhone 13 Display</p>
          </div>
        </div>
        <div>
          <p className='text-black font-bold ml-2'>Rs.25000</p>
          <div className='text-black bg-blue-400 w-[90px] px-3 rounded-full py-0.5'>Shipping</div>
        </div>
      </div>
      <div className='flex justify-between px-3 py-2 rounded-2xl mt-3 bg-blue-300 border-3 border-blue-600' >
        <div className='flex flex-col items-start'>
          <p className='text-black font-semibold'>Tracking Number</p>
          <p className='text-black text-[14px]'>TN123456789</p>
        </div>
        <div className='flex flex-col items-end'>
          <p className='text-black font-semibold '>Expected Delivery</p>
          <p className='text-black text-[14px]'>2025-01-03</p>
        </div>
      </div>
      <div className='flex justify-between mt-4'>
        <div className='flex gap-2'>
          <div className='flex gap-2 border-2 border-black w-[140px] py-0.5 rounded-md px-2 cursor-pointer'>
            {/* icon */}
            <div className='text-black '>
              View Details 
            </div>
          </div>
          <div className='flex gap-2 border-2 border-black w-[90px] py-0.5 rounded-md px-2 cursor-pointer'>
            {/* icon */}
            <div className='text-black'>
              Track 
            </div>
          </div>
        </div>
        <div>
          {/* icon */}
          <div className='text-black'>
            Contact Seller
          </div>
        </div>
      </div>
    </div>
  )
}