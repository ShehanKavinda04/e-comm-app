import React from 'react'
import FavoriteIcon from '@mui/icons-material/Favorite';
import { IconButton } from '@mui/material';

const itemDetails =[
  {
    imgUrl:"https://cdn.gadgetbytenepal.com/wp-content/uploads/2024/09/iPhone-16-Pink.jpg",
    name:'Apple',
    product:'Phone Screen',    
    mark:'Rating',
    reviews:'124 reviews',    
    title:'iPhone 14 Pro Max OLD Display Assemble ',
    price:'12500',    
  }
]


const Wishlist = () => {
  return (
    <div className='mt-3 p-1 sm:px-6 md:px-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6  ml-1 place-items-center '>
      {itemDetails.map(({imgUrl,name,product,mark,reviews,title,price},index)=><CategoryItem key={index} 
      imgUrl={imgUrl} name={name} product={product} mark={mark} reviews={reviews}
      title={title} price={price}  />)}
    </div>
  )
}

export default Wishlist

const CategoryItem = ({imgUrl,name,product,mark,reviews,title,price })=>{
   return( 
    
    <div className='bg-amber-50 w-[280px]  h-[450px] shadow-md flex flex-col items-center '>
      <div >
          <div className='w-full py-2 flex justify-center relative'>
            <img src={imgUrl} alt={name} className="max-h-[220px] object-contain"/>            
              <FavoriteIcon sx={{
                  color:"black",                  
                  marginTop:"5px",
                  top:"200px",
                  left:"230px",
                  fontSize:"25px",
                  padding:"0",
                  position:"absolute",
                  ":active":{
                    color:"red",
                  }                  
              }}/>             
          </div>
          <div className='flex gap-30 justify-center '>
            <p className='text-black text-sm  ' >{name}</p>
            <p className='text-black text-sm'>{product}</p>
          </div>
          <p className='px-4 mt-2 mb-1 text-xl sm:text-2xl text-black'>{title} </p>
          <div className='flex gap-2 ml-5'>
            <p className='text-black text-[13px]'>{mark}</p>
            <p className='text-black text-[12px]'>({reviews})</p>
          </div>
          <div className='px-7 mt-4 mb-4'>
            <p className='text-red-500 text-[18px] font-bold'>Rs. {price}</p>
          </div>        
      </div>
      <div>
          <button className='bg-orange-500 w-[245px] cursor-pointer' >Add to Card </button>
        </div>
    </div>
    )

}