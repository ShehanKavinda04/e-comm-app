import React, { useState } from 'react'
import axios from 'axios'
import Step1 from './Seller-Component/Step1'
import Step2 from './Seller-Component/Step2'
import Step3 from './Seller-Component/Step3'
import Step4 from './Seller-Component/Step4'
import PersonIcon from '@mui/icons-material/Person'
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile'
import LocationCityIcon from '@mui/icons-material/LocationCity'
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet'

const SelectIconDetails = [
  { Icon: PersonIcon, title: 'Step 1', subtitle: 'Basic Information' },
  { Icon: LocationCityIcon, title: 'Step 2', subtitle: 'Business Info' },
  { Icon: InsertDriveFileIcon, title: 'Step 3', subtitle: 'Identity Verification' },
  { Icon: AccountBalanceWalletIcon, title: 'Step 4', subtitle: 'Financial Info' }
]

const Seller = () => {
  const [section, setSection] = useState(1)
  const [formData, setFormData] = useState({
    fullName: '',
    phoneNumber: '',
    email: '',
    physicalAddress: '',
    businessName: '',
    businessType: '',
    businessDescription: '',
    nicNumber: '',
    nicDocument: null,
    proofOfAddress: null,
    sellerPhoto: null,
    bankName: '',
    accountHolderName: '',
    bankAccountNumber: '',
    branchName: ''
  })

  // submission / upload state
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0) // 0 - 100
  const [submitError, setSubmitError] = useState('')

  // universal change handler (works for inputs, selects and file inputs)
  const handleChange = (e) => {
    const { name, type, value, files } = e.target
    if (type === 'file') {
      setFormData(prev => ({ ...prev, [name]: files && files[0] ? files[0] : null }))
    } else {
      setFormData(prev => ({ ...prev, [name]: value }))
    }
  }

  // Final submit: upload all fields (including files) with progress using axios
  const handleFinalSubmit = async (e) => {
    e.preventDefault()
    setSubmitError('')
    // basic client-side validation (customize as needed)
    if (!formData.fullName || !formData.email) {
      setSubmitError('Full name and Email are required.')
      return
    }

    const payload = new FormData()
    Object.keys(formData).forEach(key => {
      const val = formData[key]
      // For file fields, if val is a File append it, otherwise append string values
      if (val instanceof File) {
        payload.append(key, val, val.name)
      } else if (val !== null && val !== undefined) {
        payload.append(key, val)
      }
    })

    try {
      setIsSubmitting(true)
      setUploadProgress(0)

      // Replace this URL with your actual backend endpoint
      const url = '/api/seller' 

      const response = await axios.post(url, payload, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        onUploadProgress: (progressEvent) => {
          if (!progressEvent) return
          const { loaded, total } = progressEvent
          if (total) {
            const percent = Math.round((loaded * 100) / total)
            setUploadProgress(percent)
          }
        },
        timeout: 5 * 60 * 1000 // optional: 5 minutes for uploads
      })

      // handle success
      console.log('Upload success', response.data)
      setUploadProgress(100)
      // TODO: show success message, navigate, or reset form
      alert('Upload successful')
    } catch (err) {
      console.error('Upload failed', err)
      setSubmitError(err?.response?.data?.message || err.message || 'Upload failed')
    } finally {
      setIsSubmitting(false)
      // optionally reset progress after a short delay:
      // setTimeout(() => setUploadProgress(0), 1000)
    }
  }

  return (
    <div className='lg:pt-[110px] md:pt-[140px] sm:pt-[185px] w-full ms:h-full md:h-screen md:overflow-scroll sm:overflow-hidden bg-gray-300'>
      {/* top section */}
      <div className='flex flex-col ml-6 '>
        <p className='text-black text-4xl '>Ready to Become a Seller!</p>
        <p className='text-gray-600' > You meet all requirements. Upload verification documents to proceed.</p>
      </div>

      <div className='h-[1px] w-full my-5 bg-black' />

      <div>
        <div className='grid lg:grid-cols-4 md:grid-cols-2 sm:grid-cols-2 gap-3'>
          {SelectIconDetails.map(({ Icon, title, subtitle }, index) => (
            <SelectIcon key={index} Icon={Icon} title={title} subtitle={subtitle} active={section === index + 1} />
          ))}
        </div>

        <form onSubmit={handleFinalSubmit}>
          {section === 1 &&
            <div className='bg-white m-7'>
              <Step1 formData={formData} onChange={handleChange} />
              <div className='flex justify-end  mt-11 mr-10'>
                <button type='button' disabled={isSubmitting} className='bg-orange-600 px-5 py-1 rounded mb-9' onClick={() => setSection(2)}>Next Step</button>
              </div>
            </div>
          }

          {section === 2 &&
            <div className='bg-white m-7'>
              <Step2 formData={formData} onChange={handleChange} />
              <div className='flex justify-between mt-10 mx-10'>
                <button type='button' disabled={isSubmitting} className='border-orange-600 border-2 text-orange-600 px-5 py-1 rounded mb-9 font-medium' onClick={() => setSection(1)}>Previous</button>
                <button type='button' disabled={isSubmitting} className='bg-orange-600  px-5 py-1 rounded mb-9' onClick={() => setSection(3)}>Next Step</button>
              </div>
            </div>
          }

          {section === 3 &&
            <div className='bg-white m-7'>
              <Step3 formData={formData} onChange={handleChange} />
              <div className='flex justify-between mt-22 mx-10'>
                <button type='button' disabled={isSubmitting} className='border-orange-600 border-2 text-orange-600 px-5 py-1 rounded mb-9 font-medium' onClick={() => setSection(2)}>Previous</button>
                <button type='button' disabled={isSubmitting} className='bg-orange-600  px-5 py-1 rounded mb-9' onClick={() => setSection(4)}>Next Step</button>
              </div>
            </div>
          }

          {section === 4 &&
            <div className='bg-white m-7'>
              <Step4 formData={formData} onChange={handleChange} />
              <div className='flex justify-between mt-11 mx-10'>
                <button type='button' disabled={isSubmitting} className='border-orange-600 border-2 text-orange-600 px-5 py-1 rounded mb-9 font-medium' onClick={() => setSection(3)}>Previous</button>
                <button type='submit' disabled={isSubmitting} className='bg-orange-600  px-5 py-1 rounded mb-9'>{
                  isSubmitting ? 'Uploading...' : 'Submit'
                }</button>
              </div>
            </div>
          }
        </form>

        {/* Upload progress & errors */}
        <div className='m-7'>
          {isSubmitting && (
            <div className='w-[90%] mx-auto'>
              <div className='text-sm mb-2'>Upload progress: {uploadProgress}%</div>
              <div className='w-full bg-gray-200 rounded-full h-3 overflow-hidden'>
                <div style={{ width: `${uploadProgress}%` }} className='bg-green-600 h-3 transition-all duration-300' />
              </div>
            </div>
          )}

          {submitError && (
            <div className='w-[90%] mx-auto mt-4 text-red-600'>
              {submitError}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Seller

// eslint-disable-next-line
const SelectIcon = ({ Icon, title, subtitle, active }) => {
  return (
    <div className={`flex gap-3 mx-7 ${active ? 'opacity-100' : 'opacity-60'}`}>
      <div className={`border px-4 py-2 flex items-center rounded-full w-[55px] h-[55px] ${active ? 'bg-black' : 'bg-gray-500'}`}>
        <Icon className='text-white text-3xl w-full' />
      </div>
      <div className='flex flex-col'>
        <p className='text-black font-bold text-[17px]' >{title}</p>
        <p className='text-black'>{subtitle}</p>
      </div>
    </div>
  )
}