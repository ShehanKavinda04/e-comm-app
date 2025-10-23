import React, { useEffect, useState } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react';
import { Grid,Navigation , Mousewheel, Keyboard } from 'swiper/modules';
import './styles.css';

import 'swiper/css';
import 'swiper/css/grid';
import 'swiper/css/navigation';
import { Link } from 'react-router-dom';
import getDataFromCollection from '../../Utils/dataFetch/getDataFromCollection';

const Category = () => {

  // get category data
  const [categoryData,setCategoryData] = useState([])
  useEffect(()=>{
    getDataFromCollection('category',setCategoryData)
  },[])

  return (
    <div className='sm:px-3 md:px-10 '>      
      <Swiper
        slidesPerView={6}
        grid={{
          rows: 1,
        }}
        spaceBetween={2}
        pagination={{
          clickable: true,
        }}
        navigation={true}
        mousewheel={true}
        keyboard={true}
        modules={[Grid,Navigation , Mousewheel, Keyboard]}
        className="mySwiper"
        breakpoints={{
          480: {   // large phones
            slidesPerView: 3,
            spaceBetween: 10,
          },
          640: {   // tablets portrait
            slidesPerView: 4,
            spaceBetween: 12,
          },
          768: {   // tablets landscape
            slidesPerView: 5,
            spaceBetween: 15,
          },
          1024: {  // laptops
            slidesPerView: 6,
            spaceBetween: 18,
          }
        }}      
      >
        {categoryData?.map(({img, title, CategoryId},index )=>(
          <SwiperSlide  key={index}>
            <div className='flex flex-col justify-center mr-0 items-center overflow-hidden rounded-full h-[100%] '>
              <ProductUnit imgUrl={img} id={index} categoryId={CategoryId}/>
            </div>
            <h3 className='text-black mt-2 text-sm sm:text-base font-medium' >{title}</h3>
          </SwiperSlide>
        ))}        
      </Swiper>
    </div>
  )
}
export default Category

const ProductUnit = ({imgUrl,categoryId, id  }) => (
  <Link to={`/category/${categoryId}`}>
    <div className='w-[140px] sm:w-[160px] md:w-[180px] lg:w-[190px] h-[120px] sm:h-[130px] cursor-pointer bg-amber-50 rounded-full overflow-hidden shadow'>
      <div>
        <img src={imgUrl} alt={`ad${id}`} className='w-full h-full object-cover hover:scale-105 transition-transform duration-300' />
      </div>    
    </div>
  </Link>
);