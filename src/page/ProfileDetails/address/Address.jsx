import React, { useRef, useState } from 'react';
import InputField from './InputField';
import SelectField from './SelectField';
import PostalProvinceRow from './PostalProvinceRow';
import FormButton from './FormButton';

const AddressForm = () => {
  const [buyerData, setBuyerData] = useState({
    firstName: '',
    lastName: '',
    postalCode: '',
    province: '',
    address: '',
    streetName: '',
  });

  const [errors, setErrors] = useState({});

  const firstNameRef = useRef();
  const lastNameRef = useRef();
  const postalCodeRef = useRef();
  const provinceRef = useRef();
  const addressRef = useRef();
  const streetNameRef = useRef();

  const validateName = (name) => /^[A-Za-z\s'-]+$/.test(name.trim()) && name.trim().length >= 2;

  const validatePostalCode = (code) => {
    const digitsOnly = code.replace(/\D/g, '');
    return /^\d{5}$/.test(digitsOnly);
  };

  const validate = () => {
    const newErrors = {};
    const firstName = firstNameRef.current?.value.trim() || '';
    const lastName = lastNameRef.current?.value.trim() || '';
    const postalCode = postalCodeRef.current?.value.trim() || '';
    const province = provinceRef.current?.value || '';
    const address = addressRef.current?.value.trim() || '';

    if (!firstName) newErrors.firstName = 'First name is required';
    else if (!validateName(firstName)) newErrors.firstName = 'Please enter a valid first name (letters only)';

    if (!lastName) newErrors.lastName = 'Last name is required';
    else if (!validateName(lastName)) newErrors.lastName = 'Please enter a valid last name (letters only)';

    if (!postalCode) newErrors.postalCode = 'Postal code is required';
    else if (!validatePostalCode(postalCode)) newErrors.postalCode = 'Invalid postal code (must be 5 digits, e.g., 00700)';

    if (!province) newErrors.province = 'Please select a province';
    if (!address) newErrors.address = 'Address is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const submitHandle = (e) => {
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
    };

    setBuyerData(newData);
    console.log('Submitted Address Data:', newData);
    alert('Address saved successfully!');
  };

  const provinces = [
    'Central',
    'Eastern',
    'North Central',
    'Northern',
    'North Western',
    'Sabaragamuwa',
    'Southern',
    'Uva',
    'Western',
  ];

  console.log('Buyer Data State:', buyerData);

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
            required
          />

          <InputField
            label="Last Name"
            placeholder="Doe"
            refProp={lastNameRef}
            error={errors.lastName}
            required
          />

          <PostalProvinceRow
            postalRef={postalCodeRef}
            provinceRef={provinceRef}
            postalError={errors.postalCode}
            provinceError={errors.province}
            provinces={provinces}
          />

          <InputField
            label="Address"
            placeholder="No. 123, Main Road"
            refProp={addressRef}
            error={errors.address}
            required
          />

          <InputField
            label="Street Name / Additional Details (optional)"
            placeholder="e.g., Near Temple"
            refProp={streetNameRef}
          />

          <div className="pt-6">
            <FormButton>Confirm</FormButton>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddressForm;