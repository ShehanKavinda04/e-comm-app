import { Button } from '@mui/material';

const PersonalDetails = ({ user, isEditing, onEditToggle, onSave, onUserChange }) => {
  const fields = [
    { label: 'Full Name', key: 'fullName' },
    { label: 'Address', key: 'address' },
    { label: 'Phone', key: 'phone' },
    { label: 'NIC', key: 'nic' },
    { label: 'Role', key: 'role' },
    { label: 'Email', key: 'email', type: 'email' },
  ];

  return (
    <div className="mt-8 mb-10">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-black">Personal Details</h3>
        <Button variant="contained" onClick={isEditing ? onSave : onEditToggle} sx={{ textTransform: 'none' }}>
          {isEditing ? 'Save Changes' : 'Edit Details'}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {fields.map(({ label, key, type = 'text' }) => (
          <div key={key}>
            <div className="flex gap-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">{label}:</label>
              {isEditing ? (
                <input
                  type={type}
                  value={user[key]}
                  onChange={(e) => onUserChange(key, e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <p className="text-gray-900">{user[key]}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PersonalDetails;