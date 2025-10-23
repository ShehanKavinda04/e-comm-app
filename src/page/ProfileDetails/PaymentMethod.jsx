import React from 'react'
import calendar from '../../img/calendar.png'
import cardIcon from '../../img/cardIcon.png'
import amex from '../../img/amex.png'
import CardNumIcon from '../../img/CardNumIcon.png'
import koko from '../../img/koko.png'
import MasterCard_1 from '../../img/MasterCard_1.png'
import MasterCard_2 from '../../img/MasterCard_2.png'
import visaCard from '../../img/visaCard.png'

const PaymentMethod = () => {
  return (
    <div className='px-5 flex flex-col gap-10 py-8 lg:px-50 md:px-15 bg-gray-100 min-h-screen'>
      {/* Title */}
      <div>
        <p className='text-black text-3xl font-semibold'>Payment Method</p>
      </div>

      {/* Payment Options Container */}
      <div className='bg-orange-600 px-6 py-5 flex flex-col  gap-6 rounded-2xl'>

        {/* KOKO Option */}
        <div className='flex justify-between bg-amber-50 rounded-2xl flex-wrap p-5 items-center'>
          <div className='flex gap-4 items-center'>
            <input
              type='radio'
              id='koko'
              name='payment_method'
              value='koko'
              className='appearance-none w-5 h-5 border border-black rounded-full checked:bg-black transition-al cursor-pointer duration-200 ring-1 ring-black'
            />
            <label htmlFor='koko' className='text-black font-semibold text-lg sm:text-xl'>
              KOKO
            </label>
          </div>
          <div className='w-[60px] sm:w-[75px]'>
            <img src={koko} alt='koko' className='w-full object-contain' />
          </div>
        </div>

        {/* Credit/Debit Card Option */}
        <div className='bg-amber-50 px-6 py-6 rounded-2xl'>
          <div className='flex gap-4 items-start'>
            <input
              type='radio'
              id='card'
              name='payment_method'
              value='card'
              className='appearance-none w-5 h-5 border border-black rounded-full checked:bg-black transition-all duration-200 ring-1 cursor-pointer ring-black mt-2'
            />
            <div className='flex-1'>
              {/* Title + Icon */}
              <div className='flex justify-between items-center flex-wrap'>
                <div className='flex flex-col gap-1'>
                  <label htmlFor='card' className='text-black font-semibold text-lg sm:text-xl'>
                    Credit / Debit Card
                  </label>
                  <p className='text-gray-600 text-sm'>We accept</p>
                </div>
                <img src={cardIcon} alt='cardIcon' className='w-[35px]' />
              </div>

              {/* Card Logos */}
              <div className='flex flex-wrap gap-3 mt-3'>
                {[visaCard, MasterCard_1, amex, MasterCard_2].map((img, i) => (
                  <div key={i} className='w-[60px] sm:w-[70px]'>
                    <img
                      src={img}
                      alt={`card-${i}`}
                      className='w-full border border-black rounded-xl px-1'
                    />
                  </div>
                ))}
              </div>

              {/* Card Details */}
              <div className='flex flex-col gap-4 mt-4'>
                {/* Card Holder */}
                <div>
                  <label className='text-black ml-1 font-medium text-sm sm:text-base'>Card Holder</label>
                  <input
                    type='text'
                    className='w-full border border-black px-4 py-2 rounded-xl focus:outline-none text-gray-700'
                    placeholder='Enter your name'
                  />
                </div>

                {/* Card Number */}
                <div>
                  <label className='text-black ml-1 font-medium text-sm sm:text-base'>Card Number</label>
                  <div className='border border-black flex items-center gap-3 px-4 py-2 rounded-xl'>
                    <img src={CardNumIcon} className='w-[22px] opacity-80' alt='CardNumIcon' />
                    <input
                      type='text'
                      placeholder='0000 0000 0000 0000'
                      className='focus:outline-none text-gray-700 w-full'
                    />
                  </div>
                </div>

                {/* Valid Date */}
                <div>
                  <label className='text-black ml-1 font-medium text-sm sm:text-base'>Valid Date</label>
                  <div className='border border-black flex items-center gap-3 px-4 py-2 rounded-xl'>
                    <img src={calendar} className='w-[20px] opacity-80' alt='calendar' />
                    <input type='date' className='focus:outline-none text-gray-700 w-full' />
                  </div>
                </div>

                {/* CVV */}
                <div>
                  <label className='text-black ml-1 font-medium text-sm sm:text-base'>CVV</label>
                  <input
                    type='text'
                    placeholder='xxx'
                    className='w-full border border-black px-4 py-2 rounded-xl text-gray-700 focus:outline-none'
                  />
                </div>

                {/* Confirm Button */}
                <div className='flex justify-center mt-6'>
                  <button className='bg-orange-600 hover:bg-orange-700 text-white text-lg font-semibold px-12 sm:px-20 py-2 rounded-full shadow-md transition-all cursor-pointer'>
                    Confirm Payment
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PaymentMethod