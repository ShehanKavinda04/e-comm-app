/* eslint-disable no-unused-vars */
import ShieldOutlinedIcon from '@mui/icons-material/ShieldOutlined';
import HeadsetOutlinedIcon from '@mui/icons-material/HeadsetOutlined';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';

const helpDetails= [
  {
    Icon:ShieldOutlinedIcon,
    topic:'Authentic Parts',
    p1:'Every product is verified for',
    p2:'Authenticity wih manufacturer',
    p3:'warranties'
  },
  {
    Icon:LocalShippingOutlinedIcon,
    topic:'Fast Delivery',
    p1:'same-day processing with',
    p2:'tracking and secure packaging',
    p3:''
  },
  {
    Icon:HeadsetOutlinedIcon,
    topic:'Expert Support',
    p1:'Technical support and',
    p2:'compatibility assistance from experts',
    p3:'experts'
  },
]

function UseHelp() {
  return (
    <div className='sm:mb-10 mt-15 w-full bg-red-600 mb-15 py-10'>
      <div className='flex flex-col justify-center items-center text-center px-5'>
        <p className='text-3xl sm:text-4xl font-semibold text-white'>Why Choose Us?</p>
        <p className='text-sm mt-2 text-gray-200'>We provide the most reliable platform for tech professionals</p>
        <p className='text-sm mb-10 text-gray-200 '>and enthusiasts</p>
      </div>
      <div className='mb-15'>
        <div className='grid grid-cols-1  sm:grid-cols-2 lg:grid-cols-3 gap-8 px-6 sm:px-12 md:px-20 lg:px-40'>
          {helpDetails.map(({Icon,topic,p1,p2,p3},index)=><UserHelpItem 
          key={index} Icon={Icon} topic={topic} p1={p1} p2={p2} p3={p3}/>)}
        </div>
      </div>
            
    </div>
  )
}

export default UseHelp

const UserHelpItem = ({Icon, topic, p1, p2, p3})=>{
  return(
    <div className='bg-amber-50 shadow-xl w-full h-[250px] rounded-2xl flex flex-col justify-center items-center hover:scale-105 transition-all '>
      <Icon sx={{ color:'black', fontSize:90 }}/>
      <div className='flex flex-col items-center justify-center text-center px-3'>
        <p className='text-black text-[18px] font-bold'>{topic}</p>
        <p className='text-black text-sm'>{p1}</p>
        <p className='text-black text-sm'>{p2}</p>
        <p className='text-black text-sm'>{p3}</p>
      </div>
    </div>
    )
}