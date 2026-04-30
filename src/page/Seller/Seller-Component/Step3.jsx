import React from 'react'
import { SellerInput } from './Step1'

const Step3 = ({ formData, setFormData }) => {
  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (files && files[0]) {
      setFormData(prev => ({ ...prev, [name]: files[0] }));
    }
  };

  const handleTextChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const FileSlot = ({ label, name, currentFile, currentUrl }) => (
    <div className="w-[100%] flex flex-col gap-3 p-4 border-2 border-dashed border-gray-300 rounded-xl bg-white shadow-sm hover:border-orange-400 transition-all">
      <div className="flex justify-between items-center">
        <p className="text-black font-semibold">{label}</p>
        {(currentFile || currentUrl) && (
          <span className="bg-green-100 text-green-700 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase">
            {currentFile ? 'Ready to Upload' : 'Uploaded'}
          </span>
        )}
      </div>
      
      {/* Preview Section */}
      <div className="h-32 w-full bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center border border-gray-200">
        {currentFile ? (
          <img src={URL.createObjectURL(currentFile)} alt="Preview" className="h-full w-full object-contain" />
        ) : currentUrl ? (
          <img src={currentUrl} alt="Existing" className="h-full w-full object-contain" />
        ) : (
          <div className="text-gray-400 flex flex-col items-center">
            <p className="text-xs">No document selected</p>
          </div>
        )}
      </div>

      <input 
        type="file" 
        name={name} 
        onChange={handleFileChange} 
        accept="image/*,application/pdf"
        className="text-xs text-gray-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-orange-600 file:text-white hover:file:bg-orange-700 cursor-pointer"
      />
    </div>
  );

  return (
    <div className="pb-10">
      <div className="flex flex-col items-center">
        <p className="text-black text-2xl font-medium mt-5">Identity Verification</p>
        <p className="text-gray-800">Upload required documents to verify your identity</p>
      </div>

      <div className="w-[90%] border-2 border-orange-500 flex gap-3 sm:mx-9 md:mx-12 lg:mx-15 rounded-xl px-7 py-2 bg-orange-200 my-5">
        <div className="border-2 flex justify-center items-center border-orange-500 w-[40px] h-[40px] rounded-full p-1">
          <p className="text-orange-500 text-3xl">!</p>
        </div>
        <div>
          <p className="text-orange-500 font-medium text-sm">Important Note </p>
          <p className="text-orange-500 font-normal text-xs">Only one seller account is allowed per NIC. Make sure all documents are clear and readable. </p>
        </div>
      </div>

      <div className="flex flex-col items-center gap-8">
        <div className="w-[90%]">
          <SellerInput 
            textLabel="NIC Number:" 
            type="text" 
            name="nicNumber" 
            value={formData.nicNumber || ''} 
            onChange={handleTextChange} 
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-[95%]">
          <FileSlot label="NIC Front View" name="nicFront" currentFile={formData.nicFront} currentUrl={formData.nicFrontUrl} />
          <FileSlot label="NIC Back View" name="nicBack" currentFile={formData.nicBack} currentUrl={formData.nicBackUrl} />
          <FileSlot label="Utility Bill" name="utilityBill" currentFile={formData.utilityBill} currentUrl={formData.utilityBillUrl} />
          <FileSlot label="Seller Photo" name="sellerPhoto" currentFile={formData.sellerPhoto} currentUrl={formData.sellerPhotoUrl} />
        </div>
      </div>
    </div>
  )
}

export default Step3