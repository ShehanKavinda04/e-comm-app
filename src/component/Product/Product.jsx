

const itemDetails =[
  {
    imgUrl:"https://cdn.gadgetbytenepal.com/wp-content/uploads/2024/09/iPhone-16-Pink.jpg",
    name:'Apple',
    product:'Phone Screen',    
    mark:'Rating',
    reviews:'124 reviews',    
    title:'IPhone 14 Pro Max OLD Display Assemble ',
    price:'12500',    
  },
  {
    imgUrl:"https://cdn.gadgetbytenepal.com/wp-content/uploads/2024/09/iPhone-16-Pink.jpg",
    name:'Apple',
    product:'Phone Screen',    
    mark:'Rating',
    reviews:'124 reviews',    
    title:'IPhone 14 Pro Max OLD Display Assemble ',
    price:'12500',
    
  },
  {
    imgUrl:"https://cdn.gadgetbytenepal.com/wp-content/uploads/2024/09/iPhone-16-Pink.jpg",
    name:'Apple',
    product:'Phone Screen',    
    mark:'Rating',
    reviews:'124 reviews',    
    title:'IPhone 14 Pro Max OLD Display Assemble ',
    price:'12500',
    
  },
  {
    imgUrl:"https://cdn.gadgetbytenepal.com/wp-content/uploads/2024/09/iPhone-16-Pink.jpg",
    name:'Apple',
    product:'Phone Screen',    
    mark:'Rating',
    reviews:'124 reviews',    
    title:'IPhone 14 Pro Max OLD Display Assemble ',
    price:'12500',
     
  }
]

const Product = () => {

  return (
    <div className='mt-15 p-3 sm:px-6 md:px-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6  ml-1 place-items-center '>
      {itemDetails.map(({imgUrl,name,product,mark,reviews,title,price},index)=><CategoryItem key={index} 
      imgUrl={imgUrl} name={name} product={product} mark={mark} reviews={reviews}
      title={title} price={price}  />)}
    </div>
  )
}

export default Product

const CategoryItem = ({imgUrl,name,product,mark,reviews,title,price })=>{
   return( 
    
    <div  className='bg-amber-50 w-[280px] sm:w-[300px] h-[470px] shadow-md cursor-pointer 
                      hover:scale-105 transition-transform rounded-lg ' >
        <div className='w-full py-2 flex justify-center'>
          <img src={imgUrl} alt={name} className="max-h-[220px] object-contain"/>
        </div>
        <div className='flex px-7 justify-between'>
          <p className='text-black text-sm  ' >{name}</p>
          <p className='text-black text-sm'>{product}</p>
        </div>
        <p className='px-7 mt-2 mb-1 text-xl sm:text-2xl text-black'>{title} </p>
        <div className='flex px-5 gap-5 ml-4 justify-start'>
          <p className='text-black text-[13px]'>{mark}</p>
          <p className='text-black text-[12px]'>({reviews})</p>
        </div>
        <div className='px-7 mt-4 mb-4'>
          <p className='text-red-500 text-[18px] font-bold'>Rs. {price}</p>
        </div>
      </div>
    )

}