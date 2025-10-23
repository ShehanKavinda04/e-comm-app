import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }

    const fetchUser = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/user/me', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUser(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch user data');
        setLoading(false);
        if (err.response?.status === 401) {
          localStorage.removeItem('token');
          navigate('/login');
        }
      }
    };

    fetchUser();
  }, [token, navigate]);

  if (loading) return <div className="text-center mt-10">Loading...</div>;
  if (error) return <div className="text-center mt-10 text-red-500">{error}</div>;
  if (!user) return <div className="text-center mt-10">No user data</div>;

  return (
    <div>
      <div className='px-5 mt-3 lg:px-30 md:px-15'>
        <div>
          <h1 className='text-3xl text-black font-semibold mb-10'>Account</h1>
          <div className='bg-white p-7 rounded shadow-md w-full h-auto flex flex-col justify-start'>
            <div className='mb-5'>
              <div className='flex flex-col items-center md:flex-row md:items-start gap-15 mx-4 my-2'>
                <div className='w-[150px] h-[150px] rounded-full mb-5'>
                  <img src={user.profileImageUrl} alt="profile" className='w-full h-full rounded-full' />
                  <div className=""></div>
                </div>
                <div className='flex flex-col justify-center'>
                  <p className='text-black font-semibold text-2xl'>{user.fullName?.toUpperCase()}</p>
                  <div className='flex items-center gap-2'>
                    <p className='text-blue-800 underline mt-1 font-medium text-sm'>{user.email}</p>
                    <p className='text-gray-700 font-normal text-sm'> - {user.role} </p>
                  </div>
                </div>
              </div>
              <div className='border-t mt-5 mb-10'>
                <div>
                  <p className='text-black font-semibold text-lg mx-4'>Account Details</p>
                  <div className='mt-5 mx-4 space-y-4'>
                    <p className='text-gray-700 font-semibold text-sm'>Full Name: <span className='ml-[8px]'>{user.fullName}</span></p>
                    <p className='text-gray-700 font-semibold text-sm'>Address: <span className='ml-[8px]'>{user.address}</span></p>
                    <p className='text-gray-700 font-semibold text-sm'>Phone: <span className='ml-[8px]'>{user.phone}</span></p>
                    <p className='text-gray-700 font-semibold text-sm'>NIC: <span className='ml-[8px]'>{user.nic}</span></p>
                    <p className='text-gray-700 font-semibold text-sm'>Role: <span className='ml-[8px]'>{user.role}</span></p>
                    <p className='text-gray-700 font-semibold text-sm'>Email: <span className='ml-[8px]'>{user.email}</span></p>
                  </div>
                </div>
              </div>
              <div className='mt-15 pt-5 grid grid-cols-1 md:grid-cols-2 gap-10 justify-between'>
                <div className='space-y-2'>
                  <p className='text-black font-semibold text-lg mx-4'>Account Details</p>
                  <p className='text-black font-normal text-[14px] mx-4'>Display Name: <span className='ml-[8px]'>{user.displayName}</span></p>
                  <p className='text-black font-normal text-[14px] mx-4'>Account Created: <span className='ml-[8px]'>{user.createdAt ? new Date(user.createdAt).toISOString().split('T')[0] : 'N/A'}</span></p>
                  <p className='text-black font-normal text-[14px] mx-4'>Account Verification: <span className='ml-[8px] text-green-600'>{user.verified ? 'verified' : 'not verified'}</span></p>
                  <p className='text-black font-normal text-[14px] mx-4'>Membership: <span className='ml-[8px] text-orange-600'>{user.membership}</span></p>
                </div>
                <div className='space-y-2'>
                  <p className='text-black font-semibold text-lg mx-4'>Security Settings</p>
                  <p className='text-black font-normal text-[14px] mx-4'>Two Factor Authentication: <span className='ml-[8px] text-blue-700'>{user.twoFactorEnabled ? 'Enabled' : 'Disabled'}</span></p>
                  <p className='text-black font-normal text-[14px] mx-4'>Security Question Set: <span className='ml-[8px]'>{user.securityQuestionSet ? 'Yes' : 'No'}</span></p>
                  <p className='text-black font-normal text-[14px] mx-4'>Login Notification: <span className='ml-[8px] text-blue-700'>{user.loginNotificationEnabled ? 'Enabled' : 'Disabled'}</span></p>
                  <p className='text-black font-normal text-[14px] mx-4'>Connected Devices: <span className='ml-[8px]'>{user.connectedDevices} Devices</span></p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;