import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import Step1 from './Seller-Component/Step1'
import Step2 from './Seller-Component/Step2'
import Step3 from './Seller-Component/Step3'
import Step4 from './Seller-Component/Step4'
import PersonIcon from '@mui/icons-material/Person'
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile'
import LocationCityIcon from '@mui/icons-material/LocationCity'
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet'
import { 
  checkSellerEligibility, 
  submitFullSellerApplication
} from '../../Services/sellerService'

const SelectIconDetails = [
  { Icon: PersonIcon, title: 'Step 1', subtitle: 'Basic Information' },
  { Icon: LocationCityIcon, title: 'Step 2', subtitle: 'Business Info' },
  { Icon: InsertDriveFileIcon, title: 'Step 3', subtitle: 'Identity Verification' },
  { Icon: AccountBalanceWalletIcon, title: 'Step 4', subtitle: 'Financial Info' }
]

const Seller = () => {
  const navigate = useNavigate()
  const [section, setSection] = useState(1)
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    physicalAddress: '',
    businessName: '',
    businessType: '',
    businessDescription: '',
    nicNumber: '',
    nicFront: null,
    nicBack: null,
    utilityBill: null,
    sellerPhoto: null,
    bankName: '',
    accountHolderName: '',
    accountNumber: '',
    branchName: ''
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')

  useEffect(() => {
    const initOnboarding = async () => {
      try {
        const eligibility = await checkSellerEligibility();
        if (!eligibility.eligible) {
          toast.error(eligibility.message);
          navigate('/profile');
          return;
        }
        // In the new "submit only at end" model, we don't fetch progress
        // unless we want to allow editing an already submitted (but maybe rejected) application.
        // For now, we just ensure they aren't already a seller or pending.
      } catch (err) {
        console.error("Eligibility check failed", err);
      }
    };
    initOnboarding();
  }, [navigate]);

  const handleChange = (e) => {
    const { name, type, value, files } = e.target
    if (type === 'file') {
      setFormData(prev => ({ ...prev, [name]: files && files[0] ? files[0] : null }))
    } else {
      setFormData(prev => ({ ...prev, [name]: value }))
    }
  }

  const handleNextStep = () => {
    setSubmitError('');
    if (isStepValid()) {
      setSection(prev => prev + 1);
      window.scrollTo(0, 0); // Scroll to top on step change
    } else {
      toast.error("Please fill in all required fields.");
    }
  };

  const handleFinalSubmit = async (e) => {
    if (e) e.preventDefault();
    setSubmitError('');
    setIsSubmitting(true);

    try {
      const multipart = new FormData();
      
      // Construct the JSON data blob for the "@RequestPart('data')"
      const dataPayload = {
        fullName: formData.fullName,
        phone: formData.phone,
        email: formData.email,
        physicalAddress: formData.physicalAddress,
        businessName: formData.businessName,
        businessType: formData.businessType,
        businessDescription: formData.businessDescription,
        nicNumber: formData.nicNumber,
        bankName: formData.bankName,
        accountHolderName: formData.accountHolderName,
        accountNumber: formData.accountNumber,
        branchName: formData.branchName
      };

      multipart.append('data', new Blob([JSON.stringify(dataPayload)], { type: 'application/json' }));

      // Append files
      if (formData.nicFront instanceof File) multipart.append('nicFront', formData.nicFront);
      if (formData.nicBack instanceof File) multipart.append('nicBack', formData.nicBack);
      if (formData.utilityBill instanceof File) multipart.append('utilityBill', formData.utilityBill);
      if (formData.sellerPhoto instanceof File) multipart.append('sellerPhoto', formData.sellerPhoto);

      await submitFullSellerApplication(multipart);
      
      toast.success('Registration Submitted Successfully! Admin will review your application.');
      setTimeout(() => navigate('/profile'), 2000);
    } catch (err) {
      console.error("Submission error:", err);
      const serverMessage = err.response?.data?.message;
      const genericMessage = 'Final submission failed. Please ensure all documents are clear and under 10MB.';
      setSubmitError(serverMessage || genericMessage);
      toast.error(serverMessage || genericMessage);
    } finally {
      setIsSubmitting(false);
    }
  }

  const isStepValid = () => {
    if (section === 1) {
      return formData.fullName && formData.phone && formData.email && formData.physicalAddress
    }
    if (section === 2) {
      return formData.businessType && formData.businessDescription
    }
    if (section === 3) {
      return formData.nicNumber && (formData.nicFront || formData.nicFrontUrl);
    }
    return true
  }

  return (
    <div className='lg:pt-[110px] md:pt-[140px] sm:pt-[185px] w-full min-h-screen bg-gray-300 pb-10'>
      {/* top section */}
      <div className='flex flex-col ml-6 '>
        <p className='text-black text-4xl '>Ready to Become a Seller!</p>
        <p className='text-gray-600' >
          {section === 1 && "Start by providing your basic contact information."}
          {section === 2 && "Tell us about your business details."}
          {section === 3 && "Identity verification is required. Please upload the necessary documents."}
          {section === 4 && "Provide your financial details to complete registration."}
        </p>
      </div>

      <div className='h-[1px] w-full my-5 bg-black' />

      <div>
        <div className='flex items-center justify-between px-10 mb-8'>
          {SelectIconDetails.map(({ Icon, title, subtitle }, index) => {
            const stepNumber = index + 1
            const isActive = section === stepNumber
            const isCompleted = section > stepNumber

            return (
              <React.Fragment key={index}>
                <div className='flex items-center gap-3'>
                  <div
                    className={`
                    w-21 h-21 rounded-full flex items-center justify-center font-bold text-white transition-all duration-300
                    ${isActive || isCompleted ? 'bg-[#D01818]' : 'bg-black'}
                  `}
                  >
                    <Icon sx={{
                      fontSize: "45px"
                    }} />
                  </div>
                  <div className='flex flex-col'>
                    <span
                      className={`font-bold text-lg ${isActive || isCompleted ? 'text-[#D01818]' : 'text-black'}`}
                    >
                      {title}
                    </span>
                    <span className='text-xs text-gray-500 font-medium whitespace-nowrap'>{subtitle}</span>
                  </div>
                </div>

                {/* Connector Line (except after last item) */}
                {index < SelectIconDetails.length - 1 && (
                  <div className='flex-1 mx-4 h-[2px] bg-gray-300 relative'>
                    <div
                      className='absolute top-0 left-0 h-full bg-[#D01818] transition-all duration-500'
                      style={{ width: isCompleted ? '100%' : '0%' }}
                    />
                  </div>
                )}
              </React.Fragment>
            )
          })}
        </div>

        <form onSubmit={handleFinalSubmit}>
          {section === 1 &&
            <div className='bg-white m-7'>
              <Step1 formData={formData} onChange={handleChange} />
              <div className='flex justify-end mt-11 mr-10'>
                <button 
                  type='button' 
                  disabled={isSubmitting || !isStepValid()} 
                  className={`px-5 py-1 rounded mb-9 text-white font-medium transition-colors ${
                    !isStepValid() ? 'bg-gray-400 cursor-not-allowed' : 'bg-orange-600 hover:bg-orange-700'
                  }`} 
                  onClick={handleNextStep}
                >
                  {isSubmitting ? 'Saving...' : 'Next Step'}
                </button>
              </div>
            </div>
          }

          {section === 2 &&
            <div className='bg-white m-7'>
              <Step2 formData={formData} onChange={handleChange} />
              <div className='flex justify-between mt-10 mx-10'>
                <button type='button' disabled={isSubmitting} className='border-orange-600 border-2 text-orange-600 px-5 py-1 rounded mb-9 font-medium hover:bg-orange-50 transition' onClick={() => setSection(1)}>Previous</button>
                <button 
                  type='button' 
                  disabled={isSubmitting || !isStepValid()} 
                  className={`px-5 py-1 rounded mb-9 text-white font-medium transition-colors ${
                    !isStepValid() ? 'bg-gray-400 cursor-not-allowed' : 'bg-orange-600 hover:bg-orange-700'
                  }`} 
                  onClick={handleNextStep}
                >
                  Next Step
                </button>
              </div>
            </div>
          }

          {section === 3 &&
            <div className='bg-white m-7'>
              <Step3 formData={formData} setFormData={setFormData} />
              <div className='flex justify-between mt-22 mx-10'>
                <button type='button' disabled={isSubmitting} className='border-orange-600 border-2 text-orange-600 px-5 py-1 rounded mb-9 font-medium hover:bg-orange-50 transition' onClick={() => setSection(2)}>Previous</button>
                <button 
                  type='button' 
                  disabled={isSubmitting || !isStepValid()} 
                  className={`px-5 py-1 rounded mb-9 text-white font-medium transition-colors ${
                    !isStepValid() ? 'bg-gray-400 cursor-not-allowed' : 'bg-orange-600 hover:bg-orange-700'
                  }`} 
                  onClick={handleNextStep}
                >
                  {isSubmitting ? 'Saving...' : 'Next Step'}
                </button>
              </div>
            </div>
          }

          {section === 4 &&
            <div className='bg-white m-7'>
              <Step4 formData={formData} onChange={handleChange} />
              <div className='flex justify-between mt-11 mx-10'>
                <button type='button' disabled={isSubmitting} className='border-orange-600 border-2 text-orange-600 px-5 py-1 rounded mb-9 font-medium' onClick={() => setSection(3)}>Previous</button>
                <button type='submit' disabled={isSubmitting} className='bg-orange-600 px-5 py-1 rounded mb-9 text-white font-medium hover:bg-orange-700 transition'>{
                  isSubmitting ? 'Submitting...' : 'Submit'
                }</button>
              </div>
            </div>
          }
        </form>

        {/* Errors */}
        <div className='m-7'>
          {submitError && (
            <div className='w-[90%] mx-auto mt-4 text-red-600 font-medium p-3 bg-red-50 border border-red-200 rounded'>
              {submitError}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Seller

