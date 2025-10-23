import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Footer from '../../component/Footer'

const Card = () => {
  return (
    <div className='pt-[190px] w-full ms:h-full  md:h-screen md:overflow-scroll sm:overflow-hidden bg-gray-300 '>
      <div className='flex flex-col justify-center items-center gap-2'>
        <ShoppingCartOutlinedIcon sx={{
          color:'black',
          fontSize:220          
        }}/>
        <p className='text-black text-3xl font-normal'>Your cart is empty</p>
        <p className='text-gray-700'>Looks like you haven't added any items to your cart yet.</p>
        <div className='bg-orange-700 mb-[90px] w-[30%] gap-2 justify-center flex px-2 py-2 cursor-pointer active:bg-orange-600'>
          <ArrowBackIcon/>
          Continue Shopping
        </div>
      </div>

      <Footer/>
    </div>
  )
}

export default Card