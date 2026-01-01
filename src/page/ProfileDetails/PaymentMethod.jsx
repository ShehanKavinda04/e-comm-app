import React, { useState } from 'react'
import StatusModal from '../../component/StatusModal';
import calendar from '../../img/calendar.png'
import cardIcon from '../../img/cardIcon.png'
import amex from '../../img/amex.png'
import CardNumIcon from '../../img/CardNumIcon.png'
import koko from '../../img/koko.png'
import MasterCard_1 from '../../img/MasterCard_1.png'
import MasterCard_2 from '../../img/MasterCard_2.png'
import visaCard from '../../img/visaCard.png'

const PaymentMethod = () => {
  const [selectedMethod, setSelectedMethod] = useState('card')
  const [cardDetails, setCardDetails] = useState({
    holder: '',
    number: '',
    expiry: '',
    cvv: ''
  })
  const [kokoDetails, setKokoDetails] = useState({
    mobile: ''
  })

  // Status Modal State
  const [statusModal, setStatusModal] = useState({
    isOpen: false,
    type: 'success', // 'success' or 'error'
    title: '',
    message: ''
  });

  const showStatus = (type, title, message) => {
    setStatusModal({
      isOpen: true,
      type,
      title,
      message
    });
  };

  const closeStatusModal = () => {
    setStatusModal(prev => ({ ...prev, isOpen: false }));
  };

  const handleCardChange = (e) => {
    const { name, value } = e.target
    setCardDetails(prev => ({ ...prev, [name]: value }))
  }

  const handleKokoChange = (e) => {
    const { name, value } = e.target
    setKokoDetails(prev => ({ ...prev, [name]: value }))
  }

  const handleConfirm = () => {
    console.log("Confirm button clicked. Method:", selectedMethod);

    if (selectedMethod === 'card') {
      const { holder, number, expiry, cvv } = cardDetails
      if (!holder) return showStatus('error', 'Missing Information', "Please enter the Card Holder Name.");
      if (!number) return showStatus('error', 'Missing Information', "Please enter the Card Number.");
      if (!expiry) return showStatus('error', 'Missing Information', "Please enter the Valid Date (MM/YY).");
      if (!cvv) return showStatus('error', 'Missing Information', "Please enter the CVV.");

      showStatus('success', 'Payment Successful', "Your payment has been processed successfully!");
    } else if (selectedMethod === 'koko') {
      const { mobile } = kokoDetails
      if (!mobile || mobile.length < 9) {
        showStatus('error', 'Invalid Mobile Number', "Please enter a valid KOKO registered mobile number.");
        return
      }
      showStatus('success', 'Payment Initiated', "Redirecting to KOKO secure payment gateway...");
    }
  }

  return (
    <div className='px-5 flex flex-col gap-10 py-8 lg:px-50 md:px-15 bg-gray-100 min-h-screen'>
      {/* Title */}
      <div>
        <p className='text-black text-3xl font-semibold'>Payment Method</p>
      </div>

      {/* Payment Options Container */}
      <div className='bg-orange-600 px-6 py-5 flex flex-col  gap-6 rounded-2xl'>

        {/* KOKO Option */}
        <div className='flex flex-col bg-amber-50 rounded-2xl p-5'>
          <div className='flex justify-between items-center w-full'>
            <div className='flex gap-4 items-center'>
              <input
                type='radio'
                id='koko'
                name='payment_method'
                value='koko'
                checked={selectedMethod === 'koko'}
                onChange={() => setSelectedMethod('koko')}
                className='appearance-none w-5 h-5 border border-black rounded-full checked:bg-black transition-all cursor-pointer duration-200 ring-1 ring-black'
              />
              <label htmlFor='koko' className='text-black font-semibold text-lg sm:text-xl'>
                KOKO
              </label>
            </div>
            <div className='w-[60px] sm:w-[75px]'>
              <img src={koko} alt='koko' className='w-full object-contain' />
            </div>
          </div>

          {/* KOKO Payment Form */}
          {selectedMethod === 'koko' && (
            <div className='mt-5 pl-2 sm:pl-9'>
              <p className='text-gray-600 text-sm mb-4'>Pay in 3 interest-free installments.</p>
              <div className='flex flex-col gap-4 max-w-md'>
                <div>
                  <label className='text-black ml-1 font-medium text-sm sm:text-base'>KOKO Registered Mobile Number</label>
                  <input
                    type='text'
                    name='mobile'
                    value={kokoDetails.mobile}
                    onChange={handleKokoChange}
                    placeholder='07X XXXXXXX'
                    className='w-full border border-black px-4 py-2 rounded-xl focus:outline-none text-gray-700 mt-1'
                  />
                </div>
                <div className='flex mt-2'>
                  <button
                    onClick={handleConfirm}
                    className='bg-orange-600 hover:bg-orange-700 text-white text-lg font-semibold px-8 py-2 rounded-xl shadow-md transition-all cursor-pointer w-full sm:w-auto'
                  >
                    Pay with KOKO
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Credit/Debit Card Option */}
        <div className='bg-amber-50 px-6 py-6 rounded-2xl'>
          <div className='flex gap-4 items-start'>
            <input
              type='radio'
              id='card'
              name='payment_method'
              value='card'
              checked={selectedMethod === 'card'}
              onChange={() => setSelectedMethod('card')}
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

              {/* Card Details - Only show if card is selected */}
              {selectedMethod === 'card' && (
                <div className='flex flex-col gap-4 mt-4'>
                  {/* Card Holder */}
                  <div>
                    <label className='text-black ml-1 font-medium text-sm sm:text-base'>Card Holder</label>
                    <input
                      type='text'
                      name='holder'
                      value={cardDetails.holder}
                      onChange={handleCardChange}
                      className='w-full border border-black px-4 py-2 rounded-xl focus:outline-none text-gray-700'
                    />
                  </div>

                  {/* Card Number */}
                  <div>
                    <label className='text-black ml-1 font-medium text-sm sm:text-base'>Card Number</label>
                    <div className='border border-black flex items-center gap-3 px-4 py-2 rounded-xl'>
                      <img src={CardNumIcon} className='w-[22px] opacity-80' alt='CardNumIcon' />
                      <input
                        type='text'
                        name='number'
                        value={cardDetails.number}
                        onChange={handleCardChange}
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
                      <input
                        type='text'
                        name='expiry'
                        value={cardDetails.expiry}
                        onChange={handleCardChange}
                        placeholder='MM/YY'
                        className='focus:outline-none text-gray-700 w-full'
                      />
                    </div>
                  </div>

                  {/* CVV */}
                  <div>
                    <label className='text-black ml-1 font-medium text-sm sm:text-base'>CVV</label>
                    <input
                      type='text'
                      name='cvv'
                      value={cardDetails.cvv}
                      onChange={handleCardChange}
                      placeholder='XXX'
                      className='w-full border border-black px-4 py-2 rounded-xl text-gray-700 focus:outline-none'
                    />
                  </div>

                  {/* Confirm Button */}
                  <div className='flex justify-center mt-6'>
                    <button
                      onClick={handleConfirm}
                      className='bg-orange-600 hover:bg-orange-700 text-white text-lg font-semibold px-12 sm:px-20 py-2 shadow-md transition-all cursor-pointer'
                    >
                      Confirm
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <StatusModal
        isOpen={statusModal.isOpen}
        onClose={closeStatusModal}
        type={statusModal.type}
        title={statusModal.title}
        message={statusModal.message}
      />
    </div>
  )
}

export default PaymentMethod