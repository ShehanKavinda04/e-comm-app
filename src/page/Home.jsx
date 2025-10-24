import Ads from '../component/ads/Ads'
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { IconButton } from '@mui/material';
import UseHelp from '../component/help/UseHelp';
import SystemHelp from '../component/help/SystemHelp';
import Footer from '../component/Footer'
import Product from '../component/Product/Product';
import Category from '../component/category/Category';





const Home = () => {
  // const paymentModalRef = useRef()
  
  return (
    <div className='pt-[130px] w-full ms:h-full  md:h-screen md:overflow-scroll sm:overflow-hidden bg-gray-300'>
      
      <div className='flex flex-col md:flex-row justify-between md:px-5'>
        <div className='ml-5 text-center mb-text-left mt-5 sm:mt-10'>
          <div>
            {/* ----------------------------top Session----------------------------- */}
            <p className='text-3xl sm:text-5xl md:text-6xl font-bold mb-14 text-black'>
              Premium Mobile <br/>
            & Laptop Parts
            </p>
            <p className='text-base sm:text-lg md:text-xl leading-relaxed text-black'>
              find authentic mobile spare parts <br/>
              and computer accessories with <br/>
              guaranteed compatibility. <br/>
              Professional quality, trusted by <br/>
              thousands.
            </p>
          </div>
          <IconButton sx={{
            marginTop:10,
            marginLeft:0,
            marginBottom:2
          }} className='mx-auto md:mx-0'>
            <span style={{
                paddingLeft:25,
                paddingRight:25,
                paddingTop:10,
                paddingBottom:10,
                fontSize:18                
              }} className='text-red-400 font-semibold border rounded-full cursor-pointer px-6 py-2 text-base sm:text-lg md:text-xl'>Shop Now</span>
          </IconButton>
        </div>
        <Ads />
      </div >
      {/* ------------------------------------mid Session--------------------------- */}
      <div className='mt-13 sm:px-3 md:px-10 px-5 text-center md:text-left'>
        <p className='text-3xl sm:text-4xl md:text-5xl font-bold mb-0 text-black' >
          Shop by Category
        </p><br/>
        <p className='text-base sm:text-lg md:text-xl mt-2 text-black mb-18'>
          Find exactly what you need for your device
        </p>
        <Category/>        
      </div>
      <div className='flex flex-col md:flex-row sm:px-3 md:px-15 justify-between mt-10 gap-7 text-center px-5 md:text-left'>
        <div>
          <p className='text-3xl sm:text-4xl md:text-5xl font-bold text-black mt-10'>Featured Products</p>
          <p className='text-sm sm:text-base md:text-lg mt-3 text-black' >Hand-picked products with best quality and value</p>
        </div>
        <IconButton sx={
            {
              padding:0,
              margin:0,
              fontSize:20
             }
          } className="mt-5 md:mt-0 sm:mt-[100px]">
          <span style={{
            paddingLeft:30,
            paddingRight:25,
            paddingTop:13,
            paddingBottom:13,
            fontSize:18,
            marginTop:10
          }} className='border-red-400 border font-semibold cursor-pointer text-red-400 rounded-full px-5 py-2 text-sm sm:text-base md:text-lg flex items-center'>View All <ChevronRightIcon sx={
            {
              fontSize:24,
              padding:0,
              margin:0,
              marginLeft:5,
              color:'red'
            }
          }/> </span>
        </IconButton>
      </div>
      {/* ------------------------------------------category Session------------------------- */}
      
      <Product/>
      <UseHelp/>
      <SystemHelp/>
      {/* ------------------------------------------footer Session------------------------- */}
      <Footer />
    </div>
  )
}

export default Home