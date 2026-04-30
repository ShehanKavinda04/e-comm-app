import React, { useRef, useState, useEffect } from 'react';
import InputField from './InputField';
import SelectField from './SelectField';
import PostalProvinceRow from './PostalProvinceRow';
import FormButton from './FormButton';
import { getUserAddress, saveUserAddress } from '../../../Services/addressService';
import { toast } from 'react-hot-toast';
import { useContext } from 'react';
import { AuthContext } from '../../../Contexts/AuthContext';


const AddressForm = () => {
  const { user: authUser, refreshUser } = useContext(AuthContext);
  const [buyerData, setBuyerData] = useState({
    firstName: '',
    lastName: '',
    postalCode: '',
    province: '',
    address: '',
    streetName: '',
    phone: '',
    city: '',
  });

  const [errors, setErrors] = useState({});
  const [isSaved, setIsSaved] = useState(false);
  const [isDirty, setIsDirty] = useState(false);

  const firstNameRef = useRef();
  const lastNameRef = useRef();
  const postalCodeRef = useRef();
  const provinceRef = useRef();
  const addressRef = useRef();
  const streetNameRef = useRef();
  const phoneRef = useRef();
  const cityRef = useRef();

  useEffect(() => {
    const fetchAddress = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      try {
        const data = await getUserAddress();
        if (data && data.address && data.address.trim() !== '') {
          setBuyerData(data);
          updateFormFields(data);
          setIsSaved(true);
          setIsDirty(false);
        } else {
          setIsSaved(false);
          setIsDirty(true);
        }
      } catch (err) {
        console.error('Error fetching address defaults', err);
        setIsSaved(false);
        setIsDirty(true);
      }
    };
    fetchAddress();
  }, []);

  // Update form fields when global authUser address is updated
  useEffect(() => {
    if (authUser && authUser.address) {
       updateFormFields(authUser.address);
       setIsSaved(true);
       setIsDirty(false);
    } else if (authUser && authUser.phone) {
       // Only update phone if address is not present but phone is updated in profile
       if (phoneRef.current) phoneRef.current.value = authUser.phone || '';
    }
  }, [authUser]);

  const updateFormFields = (data) => {
    if (firstNameRef.current) firstNameRef.current.value = data.firstName || '';
    if (lastNameRef.current) lastNameRef.current.value = data.lastName || '';
    if (postalCodeRef.current) postalCodeRef.current.value = data.postalCode || '';
    if (provinceRef.current) provinceRef.current.value = data.province || '';
    if (addressRef.current) addressRef.current.value = data.address || '';
    if (streetNameRef.current) streetNameRef.current.value = data.streetName || '';
    if (phoneRef.current) phoneRef.current.value = data.phone || '';
    if (cityRef.current) cityRef.current.value = data.city || '';
  };

  const handleFieldChange = () => {
    setIsDirty(true);
  };

  const validateName = (name) => /^[A-Za-z\s'-]+$/.test(name.trim()) && name.trim().length >= 2;

  const validatePostalCode = (code) => {
    const digitsOnly = code.replace(/\D/g, '');
    return /^\d{5}$/.test(digitsOnly);
  };

  const validatePhone = (phone) => /^\+?\d{9,12}$/.test(phone.trim());

  const validate = () => {
    const newErrors = {};
    const firstName = firstNameRef.current?.value.trim() || '';
    const lastName = lastNameRef.current?.value.trim() || '';
    const postalCode = postalCodeRef.current?.value.trim() || '';
    const province = provinceRef.current?.value || '';
    const address = addressRef.current?.value.trim() || '';
    const phone = phoneRef.current?.value.trim() || '';
    const city = cityRef.current?.value.trim() || '';

    if (!firstName) newErrors.firstName = 'First name is required';
    else if (!validateName(firstName)) newErrors.firstName = 'Please enter a valid first name (letters only)';

    if (!lastName) newErrors.lastName = 'Last name is required';
    else if (!validateName(lastName)) newErrors.lastName = 'Please enter a valid last name (letters only)';

    if (!postalCode) newErrors.postalCode = 'Postal code is required';
    else if (!validatePostalCode(postalCode)) newErrors.postalCode = 'Invalid postal code (must be 5 digits, e.g., 00700)';

    if (!province) newErrors.province = 'Please select a province';
    if (!address) newErrors.address = 'Address is required';
    
    if (!phone) newErrors.phone = 'Phone number is required';
    else if (!validatePhone(phone)) newErrors.phone = 'Please enter a valid phone number (9-12 digits)';

    if (!city) newErrors.city = 'City is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const submitHandle = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const cleanedPostal = postalCodeRef.current.value.trim().replace(/\D/g, '');

    const newData = {
      firstName: firstNameRef.current.value.trim(),
      lastName: lastNameRef.current.value.trim(),
      postalCode: cleanedPostal,
      province: provinceRef.current.value,
      address: addressRef.current.value.trim(),
      streetName: streetNameRef.current?.value.trim() || '',
      phone: phoneRef.current.value.trim(),
      city: cityRef.current.value.trim(),
    };

    try {
      const saved = await saveUserAddress(newData);
      setBuyerData(saved);
      setIsSaved(true);
      setIsDirty(false);
      if (refreshUser) refreshUser(); // Trigger global refresh
      toast.success('Address saved successfully!');
    } catch (err) {
      console.error('Error saving address:', err);
      toast.error('Failed to save address. Please try again.');
    }
  };

  const provinces = [
    { label: 'Central', value: 'CENTRAL' },
    { label: 'Eastern', value: 'EASTERN' },
    { label: 'North Central', value: 'NORTH_CENTRAL' },
    { label: 'Northern', value: 'NORTHERN' },
    { label: 'North Western', value: 'NORTH_WESTERN' },
    { label: 'Sabaragamuwa', value: 'SABARAGAMUWA' },
    { label: 'Southern', value: 'SOUTHERN' },
    { label: 'Uva', value: 'UVA' },
    { label: 'Western', value: 'WESTERN' },
  ];


  return (
    <div className="min-h-screen px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-start text-2xl font-bold text-gray-900 sm:text-3xl lg:text-4xl">
          Address
        </h1>

          <form
          onSubmit={submitHandle}
          className="mt-8 space-y-6 rounded-2xl bg-amber-50 px-6 py-8 shadow-lg sm:px-10 lg:px-16"
        >
          <InputField
            label="First Name"
            placeholder="John"
            refProp={firstNameRef}
            error={errors.firstName}
            onChange={handleFieldChange}
            required
          />

          <InputField
            label="Last Name"
            placeholder="Doe"
            refProp={lastNameRef}
            error={errors.lastName}
            onChange={handleFieldChange}
            required
          />

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <InputField
              label="City"
              placeholder="e.g., Kadawatha"
              refProp={cityRef}
              error={errors.city}
              onChange={handleFieldChange}
              required
            />
            <div className="md:col-span-2">
              <PostalProvinceRow
                postalRef={postalCodeRef}
                provinceRef={provinceRef}
                postalError={errors.postalCode}
                provinceError={errors.province}
                provinces={provinces}
                onPostalChange={handleFieldChange}
                onProvinceChange={handleFieldChange}
              />
            </div>
          </div>

          <InputField
            label="Phone Number"
            placeholder="e.g., 0712345678"
            refProp={phoneRef}
            error={errors.phone}
            onChange={handleFieldChange}
            required
          />

          <InputField
            label="Address"
            placeholder="No. 123, Main Road"
            refProp={addressRef}
            error={errors.address}
            onChange={handleFieldChange}
            required
          />


          <InputField
            label="Street Name / Additional Details (optional)"
            placeholder="e.g., Near Temple"
            refProp={streetNameRef}
            onChange={handleFieldChange}
          />

          {(isDirty || !isSaved) && (
            <div className="pt-6">
              <FormButton>Confirm</FormButton>
            </div>
          )}

          {isSaved && !isDirty && (
            <p className="text-sm text-green-600 font-medium flex items-center gap-1 pt-2">
              ✓ Address is up to date. Edit any field to make changes.
            </p>
          )}
        </form>
      </div>
    </div>
  );
};

export default AddressForm;