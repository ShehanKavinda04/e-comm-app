import React from 'react';
import InputField from './InputField';
import SelectField from './SelectField';

const PostalProvinceRow = ({
  postalRef,
  provinceRef,
  postalError,
  provinceError,
  provinces,
}) => (
  <div className="space-y-3">
    <label className="block text-sm font-medium text-gray-800 sm:text-base">
      Postal Code & Province <span className="text-red-600">*</span>
    </label>
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <InputField
        placeholder="e.g., 00700"
        refProp={postalRef}
        error={postalError}
        inputMode="numeric"
        pattern="\d*"
        maxLength="5"
      />
      <SelectField
        refProp={provinceRef}
        error={provinceError}
        options={provinces}
      />
    </div>
  </div>
);

export default PostalProvinceRow;