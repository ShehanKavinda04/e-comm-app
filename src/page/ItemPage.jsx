import { ListItemButton } from '@mui/material'
import  { useRef } from 'react'
import Footer from '../component/Footer'

const itemImages =[
  'https://c4.wallpaperflare.com/wallpaper/15/314/355/calm-clouds-forest-italy-wallpaper-preview.jpg',
  'https://c4.wallpaperflare.com/wallpaper/899/568/1006/transparency-reflection-trees-mountains-nature-hd-wallpaper-preview.jpg',
  'https://c4.wallpaperflare.com/wallpaper/78/628/890/wheat-farm-wheat-wallpaper-preview.jpg',
  'https://c4.wallpaperflare.com/wallpaper/962/152/34/frozen-lake-winter-snow-wallpaper-preview.jpg',
  'https://c4.wallpaperflare.com/wallpaper/108/140/869/digital-digital-art-artwork-fantasy-art-drawing-hd-wallpaper-preview.jpg'
]

const ItemPage = () => {
  const mainImageRef = useRef()
  const subImageRef = useRef([])
  
  return (
      <div>
        <div className='pt-[130px] w-full h-screen overflow-scroll 
    bg-gray-300 sm:px-6 md:px-20'>
          <h2 className=' text-black px-5 font-bold mb-7 text-lg'>
            Item Page
          </h2> 
          
          <div className='mx-5 flex flex-col'>
            {/* -------------------------Main Image------------------------ */}
              <div className='sm:w-[350px] md:w-[450px] lg:w-[600px] bg-gray-600 rounded-md' >
                <img
                ref={mainImageRef}
                src={itemImages[0]} alt="main image" className='w-full object-contain rounded-md'/>
              </div>
              {/* ------------------------Sub Images----------------------- */}
              <div className='sm:w-[350px] md:w-[450px] lg:w-[600px] mt-5'> 
                <div className='grid grid-cols-5 grid-rows-1 w-full mt-5 gap-3 text-center'>
                {/* */}
                {itemImages.map((ele,index)=>
                  <ListItemButton key={index} sx={{
                    padding:'0',
                    borderRadius:'2px',
                    margin:0
                  }} onClick={()=>{
                    subImageRef.current[index].style.border='2px solid black';
                    mainImageRef.current.src = subImageRef.current[index].src
                    for (let i=0; i<itemImages.length;i++){
                      if(i !== index){
                        subImageRef.current[i].style.border='none'
                      }
                    }
                    }}>
                    <img 
                      name={index}
                      ref={(refEle)=>subImageRef.current[index]=refEle}
                      src={ele} alt={ele} className='w-ful object-contain rounded-sm' />
                  </ListItemButton>
                )}
              </div>
              {/* product details */} 
              <div >
              </div>

              {/* product details */}
              <div >
                <div>
                  <div className='flex flex-col items-center'>
                    <p className='text-black text-4xl'>Shop by Brand</p>
                    <p className='text-gray-700'>Find exactly what you need for your device</p>
                  </div>
                </div>
                
              </div>
            </div>
          </div>
        </div>
        <Footer/>
      </div>
  ) 
}

export default ItemPage