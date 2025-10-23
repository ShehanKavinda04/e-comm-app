import React from 'react'
import { useLocation } from 'react-router-dom'

const NoUrl = () => {
  const {pathname}  = useLocation()
   
  return (
    <div className='w-screen h-screen flex items-center justify-center'>
      <h1 className='text-6xl font-bold '>
        404
      </h1>
      <p>The requested URL {pathname} was not found on this server. That’s all we know.</p>
    </div>
  )
}

export default NoUrl