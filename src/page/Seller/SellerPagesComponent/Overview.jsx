import React from 'react'
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import PaymentsIcon from '@mui/icons-material/Payments';
import FavoriteIcon from '@mui/icons-material/Favorite';
import AddIcon from '@mui/icons-material/Add';
import StoreIcon from '@mui/icons-material/Store';
import TimelineIcon from '@mui/icons-material/Timeline';
import FeaturedVideoIcon from '@mui/icons-material/FeaturedVideo';
import ListIcon from '@mui/icons-material/List';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import ReviewsIcon from '@mui/icons-material/Reviews';
import CardTravelIcon from '@mui/icons-material/CardTravel';

const Overview = () => {
  return (
    <div>
      <div>
        <div className='flex flex-wrap justify-center md:px-25 sm:justify-between gap-4 mb-8 mt-5 px-10'>
          <div className='flex justify-between sm:justify-around items-center bg-orange-600 text-white w-full md:w-[320px] sm:w-[170px] px-4 py-3 rounded-lg'>
            <div className='flex flex-col text-left'>
              <p className='text-[14px] font-normal'>Total Revenue</p>
              <p className='font-bold text-lg'>Rs. 58750</p>
            </div>
            <CardTravelIcon/>      

          </div>
          <div className='flex justify-between sm:justify-around items-center bg-orange-600 text-white  w-full md:w-[320px] sm:w-[185px] px-4 py-3 rounded-lg'>
            <div className='flex flex-col text-left'>
              <p className='text-[14px] font-normal'>Product Listed</p>
              <p className='font-bold'>15</p>
            </div>
            <ListIcon/>        

          </div>
          <div className='flex justify-between sm:justify-around items-center bg-orange-600 text-white w-full md:w-[320px] sm:w-[185px] px-4 py-3 rounded-lg'>
            <div className='flex flex-col'>
              <p className='text-[14px] font-normal'>Orders This Month</p>
              <p className='font-bold'>24</p>
            </div>
            <CalendarMonthIcon/>        

          </div>
          <div className='flex justify-between sm:justify-around items-center bg-orange-600 text-white w-full md:w-[320px] sm:w-[185px] px-4 py-3 rounded-lg'>
            <div className='flex flex-col'>
              <p className='text-[14px] font-normal'>Average Rating</p>
              <p className='font-bold'>4.8</p>
            </div>
            <ReviewsIcon/>         

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
                <p className='text-black text-[14px]'>Add new Product

                </p>
              </div>
              <div className='flex border-2  justify-center px-3 py-2 rounded-full gap-4 border-orange-600 cursor-pointer'> 
                <FeaturedVideoIcon sx={{
                  color:"black",
                  fontSize:"15px",
                  marginTop:"5px"
                }}/>
                <p className='text-black text-[14px] mr-5'>View Wishlist</p>
              </div>
              <div className='flex border-2  justify-center px-3 py-2 rounded-full gap-4 border-orange-600 cursor-pointer'> 
                <TimelineIcon sx={{
                  color:"black",
                  fontSize:"15px",
                  marginTop:"5px"
                }}/> 
                <p className='text-black text-[14px]'>Browse Products</p>
              </div>
              <div className='flex border-2  justify-center px-3 py-2 rounded-full gap-4 border-orange-600 cursor-pointer'> 
                <StoreIcon sx={{
                  color:"black",
                  fontSize:"15px",
                  marginTop:"5px"
                }}/> 
                <p className='text-black text-[14px] mr-2'>Update Profile</p> 
              </div>
            </div>
          </div>
          <div className='bg-gray-100 border-2 border-orange-600 px-5 py-3 w-full lg:w-[50%] rounded-2xl mb-9'>
            <div className='flex items-center justify-between'>
              <p className='text-black text-2xl'>Recent Orders</p>
              <p className='text-black text-md font-bold mt-2 cursor-pointer'>View All</p>
            </div>
            <div className='flex flex-col gap-3 mt-4 '>            
              <OrderItem status="Processing"/>
              <OrderItem status="Delivered"/>
              <OrderItem status="Shipped"/>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}

export default Overview

const OrderItem =({status })=>{
  return(
    <div className='flex flex-col sm:flex-row border-2 px-3 py-2 rounded-xl gap-4 border-orange-600 justify-between' > 
      <div className='flex flex-col gap-1 sm:justify-center'>
        <p className='text-black font-bold text-sm sm:text-base'>#123</p>
        <p className='text-black text-[12px] sm:text-[14px]'>shehan kavinda</p>
        <p className='text-black text-[12px] sm:text-[14px]'>iPhone 13 Display</p>
      </div> 
      <div className='flex flex-col items-center gap-1'>
        <p className='text-black'>
          Rs. 1500
        </p>
        <div className='text-black text-[10px] sm:text-[10px] bg-amber-300 w-[80%] py-0.5 flex justify-center rounded-full px-5'>{status }</div> 
      </div>
    </div>

  )
}