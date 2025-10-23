import React from 'react'
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import PaymentsIcon from '@mui/icons-material/Payments';
import FavoriteIcon from '@mui/icons-material/Favorite';
import PersonIcon from '@mui/icons-material/Person';
import WebIcon from '@mui/icons-material/Web';
import AddIcon from '@mui/icons-material/Add';

const Overview = () => {
  return (
    <div>
      <div className='flex flex-wrap justify-center md:px-25 sm:justify-between gap-4 mb-8 mt-5 px-10'>
        <div className='flex justify-between sm:justify-around items-center bg-orange-600 text-white w-full md:w-[320px] sm:w-[170px] px-4 py-3 rounded-lg'>
          <div className='flex flex-col text-left'>
            <p className='text-[14px] font-normal'>Total Orders</p>
            <p className='font-bold text-lg'>24</p>
          </div>
          <BusinessCenterIcon/>      

        </div>
        <div className='flex justify-between sm:justify-around items-center bg-orange-600 text-white  w-full md:w-[320px] sm:w-[185px] px-4 py-3 rounded-lg'>
          <div className='flex flex-col text-left'>
            <p className='text-[14px] font-normal'>Wishlist Items</p>
            <p className='font-bold'>15</p>
          </div>
          <FavoriteIcon/>        

        </div>
        <div className='flex justify-between sm:justify-around items-center bg-orange-600 text-white w-full md:w-[320px] sm:w-[185px] px-4 py-3 rounded-lg'>
          <div className='flex flex-col'>
            <p className='text-[14px] font-normal'>Active Orders</p>
            <p className='font-bold'>2</p>
          </div>
          <BusinessCenterIcon/>        

        </div>
        <div className='flex justify-between sm:justify-around items-center bg-orange-600 text-white w-full md:w-[320px] sm:w-[185px] px-4 py-3 rounded-lg'>
          <div className='flex flex-col'>
            <p className='text-[14px] font-normal'>Loyalty Point</p>
            <p className='font-bold'>1250</p>
          </div>
          <PaymentsIcon/>         

        </div>
      </div>
      {/* Bottom Section */}
      <div className='flex flex-col lg:flex-row gap-5 md:px-20 px-10'>

        <div className='bg-gray-100 border-2 border-orange-600 px-5 py-3 w-full lg:w-[50%] rounded-2xl'>
          <p className='text-black text-xl font-semibold'>Quick Actions</p>
          <div className='flex flex-col gap-4 mt-6'>
            <div className='flex border-2  justify-center px-3 py-2 rounded-full gap-4 border-orange-600 cursor-pointer'> 
              <AddIcon sx={{
                color:"black",
                fontSize:"15px",
                marginTop:"5px"

              }}/>
              <p className='text-black text-[14px]'>Track my Orders</p>
            </div>
            <div className='flex border-2  justify-center px-3 py-2 rounded-full gap-4 border-orange-600 cursor-pointer'> 
              <FavoriteIcon sx={{
                color:"black",
                fontSize:"15px",
                marginTop:"5px"
              }}/>
              <p className='text-black text-[14px] mr-5'>View Wishlist</p>
            </div>
            <div className='flex border-2  justify-center px-3 py-2 rounded-full gap-4 border-orange-600 cursor-pointer'> 
              <WebIcon sx={{
                color:"black",
                fontSize:"15px",
                marginTop:"5px"
              }}/> 
              <p className='text-black text-[14px]'>Browse Products</p>
            </div>
            <div className='flex border-2  justify-center px-3 py-2 rounded-full gap-4 border-orange-600 cursor-pointer'> 
              <PersonIcon sx={{
                color:"black",
                fontSize:"15px",
                marginTop:"5px"
              }}/> 
              <p className='text-black text-[14px] mr-2'>Update Profile</p> 
            </div>
          </div>
        </div>
        <div className='bg-gray-100 border-2 border-orange-600 px-5 py-3 w-full lg:w-[50%] rounded-2xl'>
          <div className='flex items-center justify-between'>
            <p className='text-black text-2xl'>Recent Orders</p>
            <p className='text-black text-md font-bold mt-2 cursor-pointer'>View All</p>
          </div>
          <div className='flex flex-col gap-3 mt-4'>            
            <OrderItem/>
            <OrderItem/>
            <OrderItem/>
          </div>
        </div>
      </div>

    </div>
  )
}

export default Overview

const OrderItem =()=>{
  return(
    <div className='flex flex-col sm:flex-row border-2 px-3 py-2 rounded-xl gap-4 border-orange-600' > 
      <div className='w-full sm:w-[25%] md:w-[20%] rounded-2xl'>
        <img src="https://m.media-amazon.com/images/I/71OexQTz4-L._SL1500_.jpg" alt="item1" className='w-full object-contain rounded-2xl' />
      </div>
      <div className='flex flex-col gap-1 sm:justify-center'>
        <p className='text-black font-bold text-sm sm:text-base'>#ORD-123</p>
        <p className='text-black text-[12px] sm:text-[14px]'>iPhone 13 Display</p>
        <div className='text-black text-[10px] sm:text-[12px] bg-amber-300 w-[80%] py-0.5 flex justify-center rounded-full'>Processing</div>
      </div>  
    </div>

  )
}