import Step1 from './Seller-Component/Step1'
import Step2 from './Seller-Component/Step2'
import Step3 from './Seller-Component/Step3'
import Step4 from './Seller-Component/Step4'
import PersonIcon from '@mui/icons-material/Person';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import LocationCityIcon from '@mui/icons-material/LocationCity';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import { useState } from 'react';


const SelectIconDetails=[
  {
    Icon:PersonIcon,
    title:'Step 1',
    subtitle:'Basic Information'
  },
  {
    Icon:LocationCityIcon,
    title:'Step 2',
    subtitle:'Basic Information'
  },
  {
    Icon:InsertDriveFileIcon,
    title:'Step 3',
    subtitle:'Basic Information'
  },
  {
    Icon:AccountBalanceWalletIcon,
    title:'Step 4',
    subtitle:'Basic Information'
  },
]

const Seller = () => {
  const [section, setSection] = useState(1)

  return (
    <div className='lg:pt-[110px] md:pt-[140px] sm:pt-[185px] w-full ms:h-full  md:h-screen md:overflow-scroll sm:overflow-hidden bg-gray-300'>
      {/* top section */}
      <div className='flex flex-col ml-6 '>
        <p className='text-black text-4xl '>Ready to Become a Seller!</p>
        <p className='text-gray-600' > You meet all requirement. Upload a verification document to proceed.</p>
      </div>
      <div className='h-[1px] w-full my-5 bg-black' />
      <div>
        <div className='grid lg:grid-cols-4 md:grid-cols-2 sm:grid-cols-2 gap-3'>
          {SelectIconDetails.map(({Icon,title,subtitle},index)=>(
            <SelectIcon key={index} Icon={Icon} title={title} subtitle={subtitle}/>
          ))}
        </div>
        {/* <form onSubmit={}> */}
          {section === 1 && 
            <div className='bg-white m-7'>
              <Step1/>
              <div className='flex justify-end  mt-11 mr-10'>
                <button type='submit'  className='bg-orange-600 px-5 py-1 rounded mb-9' onClick={() => setSection(2)}>Next Step</button>
              </div>
            </div>
          }
          {section === 2 && 
            <div className='bg-white m-7'>
              <Step2/>
              <div className='flex justify-between mt-10 mx-10'>
                <button type='submit'  className='border-orange-600 border-2 text-orange-600 px-5 py-1 rounded mb-9 font-medium' onClick={() => setSection(1)}>Previous</button>
                <button type='submit'  className='bg-orange-600  px-5 py-1 rounded mb-9' onClick={() => setSection(3)}>Next Step</button>
              </div>            
            </div>        
          }
          {section === 3 && 
            <div className='bg-white m-7'>
              <Step3/>
              <div className='flex justify-between mt-22 mx-10'>
                <button type='submit'  className='border-orange-600 border-2 text-orange-600 px-5 py-1 rounded mb-9 font-medium' onClick={() => setSection(2)}>Previous</button>
                <button type='submit'  className='bg-orange-600  px-5 py-1 rounded mb-9' onClick={() => setSection(4)}>Next Step</button>
              </div>            
            </div>        
          }
          {section === 4 && 
            <div className='bg-white m-7'>
              <Step4/>
              <div className='flex justify-between mt-11 mx-10'>
                <button type='submit'   className='border-orange-600 border-2 text-orange-600 px-5 py-1 rounded mb-9 font-medium' onClick={() => setSection(3)}>Previous</button>
                <button type='submit'   className='bg-orange-600  px-5 py-1 rounded mb-9'  >Submit</button>
              </div>            
            </div>        
          }
        {/* </form> */}
      </div>
    </div>
  )
}

export default Seller

// eslint-disable-next-line
const SelectIcon =({Icon,title,subtitle})=>{
  return(
    <div className='flex gap-3 mx-7 '>
      <div className='border px-4 py-2 bg-black flex items-center rounded-full w-[55px] h-[55px]'>
        <Icon className='text-white text-3xl w-full' />        
      </div>
      <div className='flex flex-col'>
        <p className='text-black font-bold text-[17px]' >{title}</p>
        <p className='text-black'>{subtitle}</p>
      </div>
    </div>
  )
}