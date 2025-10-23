import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import NotificationsIcon from '@mui/icons-material/Notifications';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { IconButton } from '@mui/material';
import { useState } from 'react';
import { Link } from 'react-router-dom';

const Header = ({darkModalRef}) => {
  const [isSearch,setIsSearch ] = useState(false)
  const [clickButton, setClickButton]=useState(
  {
    Notification:false,
    Card: false,
    Profile: false
  })
  return (
    <div className='fixed top-0 left-0 z-[100]
     w-full py-3 px-2 sm:px-6 md:px-10 flex justify-between items-center bg-[#f75252] shadow-md'>
      {/* ----------------------Header left--------------------- */}
      <div >
        <div > 
          <p className='text-3xl font-bold text-white' >TECH NOVA </p>
          <p style={
            {
              display: window.innerWidth< 640? isSearch? "none" :"inline-block" :"inline-block"
            }} className='text-sm font-medium text-gray-100' >Mobile & Laptop Parts</p>                    
        </div>
      </div>
      {/* ----------------------Header mid-------------- */}    
      <div className='flex items-center gap-3 border p-2 rounded-md bg-white'>
        <div className='flex items-center gap-2'>
          <IconButton onClick={()=>{if(window.innerWidth<640){setIsSearch(!isSearch)}}}>
            <SearchOutlinedIcon sx={{
              color: '#f75252',
            }}/>
          </IconButton>
          <input className='outline-none text-black w-[250px] sm:w-[300px] font-sans ' style={
            {
              display: window.innerWidth< 640? isSearch? "inline-block" :"none" :"inline-block"
            }
            } placeholder='Search' type="text" />
        </div>
        <div>
          <IconButton>
            <PhotoCameraIcon sx={{
              color: '#f75252',
            }}/>
          </IconButton>
        </div>
      </div>      
      {/* --------------Header right----------- */}
      <div> 
        <div  className='flex items-center space-x-6 '>
          <p className='font-medium text-white hidden sm:block cursor-pointer'>Catalog</p>
          <div style={
            {
              display: window.innerWidth< 640? isSearch? "inline-block" :"none" :"inline-block"
            }} className='flex items-center gap-2 mr-0'>            
            <div className='relative'>
              <HeaderIcon icon={{clickButton, setClickButton}} Icon={NotificationsIcon} iconTest='Notification' />              
              <div className='top-[10px] left-[25px] rounded-full w-5 h-5 bg-red-700 absolute font-semibold right-0 flex items-center justify-center text-white text-[13px]'>
                3
              </div>
              <HeaderIcon icon={{clickButton, setClickButton}} Icon={ShoppingCartIcon} iconTest='Card' />
              <IconButton onClick={()=>{darkModalRef.current.handleOpen()}}>
                <AccountCircleIcon sx={{ color: "white",
                   fontSize: 30
                 }} />
              </IconButton>

              {/* <button className='bg-blue-300 '  onClick={()=>{paymentModalRef.current.handleOpen()}}> click me </button> */}
            </div>            
          </div>          
        </div>
      </div>
    </div>
  )
}
export default Header
// eslint-disable-next-line no-unused-vars
const HeaderIcon = ({ Icon, iconTest, icon }) => {
  const headerLink = () => {
    const obj = {
      Notification: false,
      Card: false,
      Profile: false
    };
    if (iconTest === "Notification") {
      obj.Notification = true;
    } else if (iconTest === "Card") {
      obj.Card = true;
    } else if (iconTest === "Profile") {
      obj.Profile = true;
    }
    icon.setClickButton(obj);
  };
  return (
    <Link to={iconTest === 'Home' ? '/' : `/${String(iconTest).toLowerCase()}`}>
      <IconButton onClick={headerLink} >
        <Icon sx={{ color: "white",
           fontSize: 30
         }} />
      </IconButton>
    </Link>
  );
};