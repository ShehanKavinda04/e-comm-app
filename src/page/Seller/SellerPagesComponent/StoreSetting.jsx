import React, { useState, useEffect, useRef } from 'react';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { useDispatch, useSelector } from 'react-redux';
import { updateSettings } from '../../../Store/ReduxSlice/sellerSlice';

const StoreSetting = () => {
  const dispatch = useDispatch();
  const { settings } = useSelector((state) => state.seller);
  const logoInputRef = useRef(null);
  const bannerInputRef = useRef(null);

  const [formData, setFormData] = useState({
    storeName: "",
    email: "",
    phone: "",
    ordersNotification: true,
    messagesNotification: true,
    stockNotification: true
  });

  const [message, setMessage] = useState("");

  useEffect(() => {
    if (settings) {
      setFormData(settings);
    }
  }, [settings]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleFileChange = (e, field) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          [field]: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    dispatch(updateSettings(formData));
    setMessage("Settings saved successfully!");
    setTimeout(() => setMessage(""), 3000);
  };

  const ToggleSwitch = ({ name, checked, onChange }) => (
    <label className="relative inline-flex items-center cursor-pointer">
      <input
        type="checkbox"
        name={name}
        checked={checked}
        onChange={onChange}
        className="sr-only peer"
      />
      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-600"></div>
    </label>
  );

  return (
    <div className='flex flex-col gap-5 mb-10 p-6'>
      <div className="flex justify-between items-center mx-4">
        <p className='text-black text-2xl font-bold'>Store Settings</p>
        <button
          onClick={handleSave}
          className="bg-black text-white px-6 py-2 rounded-full font-medium hover:bg-gray-800 transition shadow-sm cursor-pointer"
        >
          Save Changes
        </button>
      </div>

      {message && (
        <div className="mx-10 p-3 bg-green-100 text-green-700 rounded-lg text-center font-medium">
          {message}
        </div>
      )}

      {/*--------------General Information component---------------- */}
      <div>
        <p className='text-black text-xl font-semibold mx-7 mb-3'>General Information</p>
      </div>
      <div className='flex flex-col gap-4 bg-gray-100 mx-10 p-7 rounded-xl'>
        <div className='flex flex-col gap-1'>
          <label htmlFor="storeName" className='text-black font-medium'>Store Name</label>
          <input
            type="text"
            name="storeName"
            value={formData.storeName || ""}
            onChange={handleChange}
            className='border rounded focus:outline-none px-3 py-2 border-gray-300 focus:border-orange-500 text-black font-medium transition-colors'
          />
        </div>
        <div className='flex flex-col gap-1'>
          <label htmlFor="email" className='text-black font-medium'>Contact Email</label>
          <input
            type="email"
            name="email"
            value={formData.email || ""}
            onChange={handleChange}
            className='border rounded focus:outline-none px-3 py-2 border-gray-300 focus:border-orange-500 text-black font-medium transition-colors'
          />
        </div>
        <div className='flex flex-col gap-1'>
          <label htmlFor="phone" className='text-black font-medium'>Phone Number</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone || ""}
            onChange={handleChange}
            className='border rounded focus:outline-none px-3 py-2 border-gray-300 focus:border-orange-500 text-black font-medium transition-colors'
          />
        </div>
      </div>

      {/*--------------Appearance component---------------- */}
      <div>
        <p className='text-black text-xl font-semibold mx-7 mb-3'>Appearance</p>
      </div>
      <div className='bg-gray-100 p-8 gap-5 mx-10 rounded-xl'>
        <input
          type="file"
          ref={logoInputRef}
          className="hidden"
          accept="image/*"
          onChange={(e) => handleFileChange(e, 'logo')}
        />
        <input
          type="file"
          ref={bannerInputRef}
          className="hidden"
          accept="image/*"
          onChange={(e) => handleFileChange(e, 'banner')}
        />

        <div className='flex gap-10 items-center'>
          <div className='w-20 h-20 rounded-full bg-gray-300 flex items-center justify-center overflow-hidden border-2 border-white shadow'>
            {formData.logo ? <img src={formData.logo} alt="Logo" className="w-full h-full object-cover" /> : <span className="text-gray-500 text-xs">No Logo</span>}
          </div>
          <div className='flex flex-col gap-1'>
            <p className='text-black font-medium'>Store Logo</p>
            <button
              onClick={() => logoInputRef.current?.click()}
              className='text-blue-600 font-medium text-sm hover:underline text-left cursor-pointer'
            >
              Change Logo
            </button>
          </div>
        </div>
        <div className='bg-gray-300 h-px w-full my-5' />
        <p className='text-black font-medium mb-4'>Store Banner</p>
        <div>
          <div className='bg-gray-300 h-[150px] w-full rounded-xl flex items-center justify-center overflow-hidden'>
            {formData.banner ? <img src={formData.banner} alt="Banner" className="w-full h-full object-cover" /> : <span className="text-gray-500">No Banner Image</span>}
          </div>
          <button
            onClick={() => bannerInputRef.current?.click()}
            className='text-blue-600 font-medium text-sm mt-2 hover:underline cursor-pointer'
          >
            Change Banner
          </button>
        </div>
      </div>

      {/*--------------Notification Settings component---------------- */}
      <div className='mx-9'>
        <p className='text-black text-xl font-semibold'>Notification Settings</p>
      </div>
      <div className='bg-gray-100 p-7 mx-10 rounded-2xl'>
        <div className='flex flex-col gap-4'>
          <div className='flex justify-between items-center'>
            <p className='text-black font-medium'>New Orders</p>
            <ToggleSwitch
              name="ordersNotification"
              checked={formData.ordersNotification}
              onChange={handleChange}
            />
          </div>
          <div className='bg-gray-300 w-full h-px' />
          <div className='flex justify-between items-center'>
            <p className='text-black font-medium'>New Messages</p>
            <ToggleSwitch
              name="messagesNotification"
              checked={formData.messagesNotification}
              onChange={handleChange}
            />
          </div>
          <div className='bg-gray-300 w-full h-px' />
          <div className='flex justify-between items-center'>
            <p className='text-black font-medium'>Low Stock Alerts</p>
            <ToggleSwitch
              name="stockNotification"
              checked={formData.stockNotification}
              onChange={handleChange}
            />
          </div>
        </div>
      </div>

      {/*--------------Policies component (Static Links for now)---------------- */}
      <div className='mx-9'>
        <p className='text-black text-xl font-semibold'>Policies</p>
      </div>
      <div className='bg-gray-100 p-7 mx-10 rounded-2xl'>
        <div className='flex flex-col gap-4'>
          {['Shipping Policy', 'Return Policy', 'Privacy Policy'].map((policy, index) => (
            <React.Fragment key={policy}>
              <div className='flex justify-between cursor-pointer hover:opacity-70 transition group'>
                <p className='text-black font-medium'>{policy}</p>
                <ArrowForwardIosIcon sx={{ fontSize: 14 }} className="text-gray-400 group-hover:text-black transition-colors" />
              </div>
              {index < 2 && <div className='bg-gray-300 w-full h-px' />}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  )
}

export default StoreSetting