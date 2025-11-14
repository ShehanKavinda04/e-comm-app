import React, { useEffect, useRef, useState } from 'react'

const Address = () => {
  const [buyerData,setBuyerData] = useState({
    firstName:'',
    lastName:'',
    postalCode:'',
    address:'',
    streetName:'',

  })

  // useEffect(()=>{
  //   submitHandle()
  //   console.log(buyerData)

  // },[buyerData])
  

  const firstNameRef = useRef()
  const lastNameRef = useRef()
  const postalCodeRef = useRef()
  const addressRef = useRef()
  const streetNameRef = useRef()

  const submitHandle=(e)=>{
    e.preventDefault()
    setBuyerData((pre)=>({
      ...pre,
      firstName:firstNameRef.current?.value||'',
      lastName:lastNameRef.current?.value||'',
      postalCode:postalCodeRef.current?.value||'',
      address:addressRef.current?.value||'',
      streetName:streetNameRef.current?.value||'',

    })) 
  }

  return (
    <div className='px-6 pb-9 lg:px-40 md:px-15'>
      <div>
        <p className='text-black text-3xl font-md '>Address</p>
      </div>
      <div className='flex flex-col justify-center pt-5 bg-amber-50 mt-8 px-9 gap-5'>
        <div className='flex flex-col gap-0.5'>
          <p className='text-black font-medium'>First Name:</p>
          <input className='border-2 rounded-full border-orange-700 text-gray-700 w-full px-1 py-0.5 ' type="text"  ref={firstNameRef} />
        </div>
        <div className='flex flex-col gap-0.5'>
          <p className='text-black font-medium'>Last Name:</p>
          <input className='border-2 rounded-full border-orange-700 text-gray-700 w-full px-1 py-0.5' type="text" ref={lastNameRef} />
        </div>
        <div>
          <p className='text-black font-medium'>Postal Code:</p>
          <div className='grid grid-cols-2 items-center gap-5'>
            <div className='flex flex-col gap-0.5'>
              <input className='border-2 rounded-full border-orange-700 text-gray-700 w-full px-1 py-0.5' type="text" ref={postalCodeRef}/>
            </div>
            <div>
              <select className='border-2 rounded-full transition-colors duration-200 border-orange-700 text-gray-700 w-full px-1 py-0.5 ' name="" id="">
                
              </select>
            </div>
          </div>
        </div>
        <div className='flex flex-col gap-0.5'>
          <p className='text-black font-medium'>Address:</p>
          <input className='border-2 rounded-full border-orange-700 text-gray-700 w-full px-1 py-0.5' type="text" ref={addressRef} />
        </div>
        <div className='flex flex-col gap-0.5'>
          <p className='text-black font-medium'>Street Name (optional):</p>
          <input className='border-2 rounded-full border-orange-700 text-gray-700 w-full px-1 py-0.5' type="text"  ref={streetNameRef}/>
        </div>
        <div className='flex mt-12  mb-17 justify-center'>
          <button className='w-[80%] px-3 py-0.5 bg-orange-600 cursor-pointer' onClick={submitHandle}>conform</button>
        </div>
      </div>
    </div>
  )
}

export default Address