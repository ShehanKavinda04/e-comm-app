import { IconButton } from '@mui/material'
import FacebookOutlinedIcon from '@mui/icons-material/FacebookOutlined';
import { WhatsApp } from '@mui/icons-material';
import { Instagram } from '@mui/icons-material';
import { LinkedIn } from '@mui/icons-material';
import PlaceIcon from '@mui/icons-material/Place';
import CallIcon from '@mui/icons-material/Call';
import LocalPostOfficeIcon from '@mui/icons-material/LocalPostOffice';
import CopyrightIcon from '@mui/icons-material/Copyright';

const Footer = () => {
  const leftIconDetails = [
    {
      IconLeft:PlaceIcon,
      details1:`123 Main Street, Battaramulla, Koswatta`, 
      details2:` Koswatta` 
    },
    {
      IconLeft:CallIcon,
      details1:'+94123456789',
      details2:''
    },
    {
      IconLeft:LocalPostOfficeIcon,
      details1:'spport@technova.com',
      details2:''
    },
  ]
  const rigthIconDetails=[
    {
      IconRigth:FacebookOutlinedIcon
    },
    {
      IconRigth:WhatsApp
    },
    {
      IconRigth:Instagram
    },
    {
      IconRigth:LinkedIn
    },
  ]
  return (
    <div className='bottom-0 bg-red-500 left-0 
     w-full pt-10 pb-5 sm:px-6 md:px-20 '>
     {/*----------------------Session 1----------------------- */}
      <div className='sm: flex items-center justify-center'>
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 px-5'>
          <div>
            <div className='flex gap-3 items-center' >
              <div className='bg-gray-100 h-[50px] w-[50px] rounded-full flex items-center justify-center'>
                <img src="asda" alt="dads" className='w-full object-contain' />
              </div>
              <div>
                <p className='text-2xl font-bold text-white'>TECH NOVA</p>
                <p className='text-sm font-semibold text-gray-200' >Mobile & Laptop Part </p>
              </div>
            </div>
            <div className='mt-4 text-gray-200 text-[12px] leading-4'>
              <p className='text-[11px]'>Your trusted marketplace for authentic mobile</p>
              <p className='text-[11px]'>spare parts and computer accessories. Quality </p>
              <p className='text-[11px]'>product with genuine warranties</p>
            </div>
            <div className='mt-2'>
              {rigthIconDetails.map(({IconRigth},index)=>
              <RightIcon key={index} IconRigth={IconRigth} />
              )}    
            </div>
            
          </div>
          {/*----------------------Session 2----------------------- */}
          <div className='flex flex-col gap-2 text-white'>
            <p className='text-[17px] font-semibold'>Quick Links</p>
            <p className='text-[13px] hover:underline cursor-pointer'>All products</p>
            <p className='text-[13px] hover:underline cursor-pointer'>privacy & Service</p>
            <p className='text-[13px] hover:underline cursor-pointer'>Terms of Service</p>
            <p className='text-[13px] hover:underline cursor-pointer' >Cookie Police</p>
          </div>
          {/*----------------------Session 3----------------------- */}
          <div className='flex flex-col gap-2 text-white'> 
            <p className='text-[17px] font-semibold'>Support</p>
            <p className='text-[13px] hover:underline cursor-pointer'>Help Center</p>
            <p className='text-[13px] hover:underline cursor-pointer'>Order Tracking</p>
            <p className='text-[13px] hover:underline cursor-pointer'>Return & Refund</p>
            <p className='text-[13px] hover:underline cursor-pointer'>Warranty Claim</p>
            <p className='text-[13px] hover:underline cursor-pointer'>Contact Support</p>

          </div>
          {/*----------------------Session 4----------------------- */}
          <div className='flex flex-col gap-3 text-white'>
            <div>
              <p className='text-[17px] font-semibold'>Contact</p>
            </div>
            {leftIconDetails.map(({IconLeft,details1,details2},index)=><LeftIcon key={index} 
            IconLeft={IconLeft} details1={details1} details2={details2} />)}          

            <p className='text-[12px] leading-5 mt-2'>Business Horus <br/>
            Mon-Fri: 9:00 AM - 6.00 PM <br />
            Sat: 10:00 AM - 6.00 PM <br /> 
            Sun: Closed</p>

          </div>
        </div>
      </div>
      <div className='flex flex-col items-center mt-6'>
        <div className='w-full lg:w-[750px] h-[2px] bg-amber-50'  ></div>
        <div className='flex items-center justify-center mt-3 mb-[35px]'>
          <CopyrightIcon sx={{
          fontSize:'14px'}}/>
          <p className='text-[13px] font-medium text-white ml-1' >2025 Tech Nova.All rights reserved.</p>
        </div>
      </div>
     </div>
  )
}

export default Footer

// eslint-disable-next-line no-unused-vars
const LeftIcon= ({IconLeft,details1,details2})=>{
  return(

    <div className='flex gap-2 items-start'>
      <IconLeft sx={{
        fontSize:'18px',
        color: 'white'
      }}/>
      <p className='text-[12px] text-gray-200'>{details1}
        <br />
        {details2}
      </p>
    </div>
  )
}

// eslint-disable-next-line no-unused-vars
const RightIcon=({IconRigth})=>{
  return(
    <IconButton>
      <IconRigth sx={{
        color: 'white', 
        fontSize: '22px'               
      }} />
    </IconButton>

  )
}