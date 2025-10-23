import { Rating } from '@mui/material'
import React from 'react'

const memberDetails = [
  {
    ImgUrl: "https://www.shutterstock.com/image-vector/cute-cool-boy-dabbing-pose-600nw-2471006391.jpg",
    name: 'Ayodya Senavirathne',
    role: 'Computer Shop Owner',
    title: 'The best platform for genuine spare parts. Fast delivery and excellent quality every time.',
    rate: 2.5,
  },
  {
    ImgUrl: "https://www.shutterstock.com/image-vector/cute-cool-boy-dabbing-pose-600nw-2471006391.jpg",
    name: 'Kasun Perera',
    role: 'Laptop Repair Technician',
    title: 'Reliable service and great prices. I always get my orders on time.',
    rate: 4.0,
  },
]

const SystemHelp = () => {
  return (
    <div className='text-black mx-5 sm:px-3 md:px-20 mb-10 flex flex-col items-center'>
      <div>
        <div className='flex flex-col items-center mb-8 text-center'>
          <p className='text-3xl sm:text-4xl font-semibold'>What Our Customers Say</p>
          <p className='text-[15px] sm:text-[17px] text-gray-600 mt-2'>Trusted by Professionals and enthusiasts worldwide</p>
        </div>

        <div className='flex flex-col gap-5 w-full max-w-[850px]'>
          {memberDetails.map(({ ImgUrl, name, role, title, rate }, index) => (
            <MemberBlock
              ImgUrl={ImgUrl}
              name={name}
              role={role}
              title={title}
              rate={rate}
              key={index}
            /> 
          ))}
        </div>
      </div>
    </div>
  )
}

export default SystemHelp

const MemberBlock = ({ ImgUrl, name, role, title, rate }) => {
  return (
    <div className='bg-white flex flex-col sm:flex-row items-center sm:items-start gap-4 
                    border border-red-400 rounded-full py-4 px-5 shadow-sm hover:shadow-md 
                    transition w-full'>
      {/* Profile Image */}
      <div className='bg-amber-600 w-[64px] h-[64px] rounded-full overflow-hidden flex-shrink-0'>
        <img className='w-full h-full object-cover' src={ImgUrl} alt={name} />
      </div>

      {/* Member Details */}
      <div className='flex flex-col w-full'>
        <div className='flex flex-col sm:flex-row justify-between sm:items-center w-full'>
          <div>
            <p className='font-bold text-sm sm:text-base'>{name}</p>
            <p className='text-[12px] sm:text-[13px] text-gray-600'>{role}</p>
          </div>
          <div className="mt-1 sm:mt-0">
            <Rating name="half-rating-read" defaultValue={rate} precision={0.5} readOnly />
          </div>
        </div>
        <p className='text-sm mt-2 text-gray-800 italic'>"{String(title).substring(0,85)}{String(title).length > 85? '......': null}"</p>
      </div>
    </div>
  )
}
