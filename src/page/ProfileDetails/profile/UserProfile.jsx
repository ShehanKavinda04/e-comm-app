import { useState, useContext, useEffect, useRef } from 'react';
import { AuthContext } from '../../../Contexts/AuthContext';
import ProfileHeader from './ProfileHeader';
import PersonalDetails from './PersonalDetails';
import AccountInfo from './AccountInfo';
import SecuritySettings from './SecuritySettings';
import { getUserProfile, updateUserProfile as updateProfileAPI, deleteProfileImage as deleteProfileImageAPI } from '../../../Services/userService';
import { toast } from 'react-hot-toast';
import { API_BASE_URL } from '../../../Services/api';

const getImageUrl = (imagePath) => {
  if (!imagePath) return null;
  if (imagePath.startsWith('data:') || imagePath.startsWith('http')) return imagePath;
  const baseUrl = API_BASE_URL.replace('/api/', '');
  return `${baseUrl}/${imagePath}`;
};

const UserProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const { user: authUser, updateUserProfile: updateAuthContext, refreshUser } = useContext(AuthContext);
  const [profilePic, setProfilePic] = useState(null);
  const selectedFileRef = useRef(null);

  const [user, setUser] = useState({
    fullName: '',
    email: '',
    address: '',
    phone: '',
    nic: '',
    role: '',
    createdAt: '',
    displayName: '',
    membership: '',
  });

  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: false,
    loginNotifications: false,
    hasSecurityQuestion: false,
    connectedDevices: 0,
  });

  useEffect(() => {
    const loadProfile = async () => {
      // First, populate from AuthContext to avoid showing "User Name" fallbacks
      if (authUser) {
        populateFromAuthContext();
      }

      const token = localStorage.getItem('token');
      if (token) {
        try {
          const data = await getUserProfile();
          if (data) {
            setUser({
              fullName: data.fullName || authUser?.fullName || authUser?.name || '',
              email: data.email || authUser?.email || '',
              address: formatAddress(data.address),
              phone: data.phone || authUser?.phone || '',
              nic: data.nic || authUser?.nic || '',
              role: data.role || authUser?.role || 'BUYER',
              createdAt: data.createdAt || authUser?.createdAt || new Date().toISOString(),
              displayName: data.displayName || data.fullName?.split(' ')[0] || authUser?.displayName || '',
              membership: data.membershipStatus || authUser?.membership || 'Standard',
            });

            setSecuritySettings({
              twoFactorAuth: data.twoFactorEnabled || false,
              loginNotifications: data.loginNotificationEnabled || false,
              hasSecurityQuestion: data.securityQuestionsSet || false,
              connectedDevices: data.connectedDevices || 0,
            });

            if (data.profileImageUrl) {
              setProfilePic(getImageUrl(data.profileImageUrl));
            } else if (authUser?.image) {
              setProfilePic(getImageUrl(authUser.image));
            }
          }
        } catch (err) {
          console.error('Error fetching profile from backend:', err);
          // populateFromAuthContext already called, so we're safe with current state
        }
      }
      setLoading(false);
    };

    loadProfile();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authUser]);

  // Note: Removed context-to-state sync to prevent overwriting fresh backend data with stale context data.
  // Initial load once or on demand via refreshUser is enough for this component's state.


  const formatAddress = (addr) => {
    if (!addr) return '';
    const parts = [
      addr.address,
      addr.streetName,
      addr.city,
      addr.province,
      addr.postalCode
    ].filter(Boolean);
    return parts.join(', ');
  };

  const populateFromAuthContext = () => {
    if (authUser) {
      setUser({
        fullName: authUser.name || authUser.fullName || 'User Name',
        email: authUser.email || 'user@example.com',
        address: formatAddress(authUser.address),
        phone: authUser.phone || '',
        nic: authUser.nic || '',
        role: authUser.role || 'BUYER',
        createdAt: authUser.createdAt || new Date().toISOString(),
        displayName: authUser.name?.split(' ')[0] || 'User',
        membership: authUser.membership || 'Standard',
      });
      if (authUser.image) setProfilePic(getImageUrl(authUser.image));
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      selectedFileRef.current = file;
      const reader = new FileReader();
      reader.onloadend = () => setProfilePic(reader.result);
      reader.readAsDataURL(file);
      setIsEditing(true);
    }
  };

  const handleSave = async () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const formData = new FormData();
        let cleanedPhone = (user.phone || '').trim().replace(/\s+/g, '');
        // Strip leading zero if it exists for Sri Lanka numbers (+94)
        if (cleanedPhone.startsWith('0')) {
          cleanedPhone = cleanedPhone.substring(1);
        }
        
        formData.append('data', new Blob([JSON.stringify({ 
          fullName: user.fullName,
          phone: cleanedPhone || '0000000000', // Default if empty to avoid 400
          countryCode: '+94', 
          nic: user.nic,
          displayName: user.displayName 
        })], { type: 'application/json' }));

        if (selectedFileRef.current) {
          formData.append('file', selectedFileRef.current);
        }

        // Optimistically update AuthContext immediately for real-time Navbar sync
        if (updateAuthContext) {
          updateAuthContext({ 
            name: user.fullName,
            fullName: user.fullName,
            displayName: user.displayName,
            image: profilePic // Use current state (null means deleted)
          });
        }

        await updateProfileAPI(formData);
        toast.success('Profile updated successfully!');
        setIsEditing(false);
        
        // Final refresh to ensure everything is in sync with backend (e.g. generated filenames)
        if (refreshUser) {
          await refreshUser();
        }
      } catch (error) {
        console.error("Profile update failed:", error);
        toast.error(error.response?.data?.message || 'Failed to update profile');
      }
    } else {
      toast.error('Authentication required');
    }
  };

  const handleDeleteImage = async () => {
    try {
      await deleteProfileImageAPI();
      setProfilePic(null);
      if (selectedFileRef.current) selectedFileRef.current = null;
      
      // Real-time synchronization for Navbar
      if (updateAuthContext) {
        updateAuthContext({ image: null });
      }
      
      if (refreshUser) await refreshUser();
      toast.success('Profile image removed');
    } catch (error) {
      toast.error('Failed to remove image');
    }
  };

  const handleUserChange = (key, value) => {
    setUser(prev => ({ ...prev, [key]: value }));
  };

  const toggle2FA = async (e) => {
    // If it's a MUI Switch, the first argument is event. We need to prevent immediate state change if possible,
    // but MUI Switch is often controlled. Let's just run the prompt.
    const password = window.prompt("To change 2FA settings, please enter your password:");
    if (!password) return;

    try {
      const newState = !securitySettings.twoFactorAuth;
      await api.post('/auth/2fa/toggle', { password, enable: newState });
      setSecuritySettings(prev => ({ ...prev, twoFactorAuth: newState }));
      toast.success(`Two-Factor Authentication ${newState ? 'enabled' : 'disabled'} successfully`);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to toggle 2FA');
    }
  };

  const toggleLoginNotifications = async () => {
    const password = window.prompt("To change notification settings, please enter your password:");
    if (!password) return;

    try {
      const newState = !securitySettings.loginNotifications;
      await api.post('/auth/login-notification/toggle', { password, enable: newState });
      setSecuritySettings(prev => ({ ...prev, loginNotifications: newState }));
      toast.success(`Login notifications ${newState ? 'enabled' : 'disabled'}`);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to toggle notifications');
    }
  };
  const handleManageDevices = () => alert('Redirect to Connected Devices management page');
  const handleChangeSecurityQuestion = () => alert('Open modal to change security question');

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  return (
    <div className="text-black min-h-screen">
      <div className="px-5 mt-3 lg:px-30 md:px-15">
        <h1 className="text-3xl text-black font-semibold mb-10">Account</h1>

        <div className="bg-white p-7 rounded shadow-md">
          <ProfileHeader
            profilePic={profilePic}
            fullName={user.fullName}
            email={user.email}
            role={user.role}
            onImageUpload={handleImageUpload}
            onImageDelete={handleDeleteImage}
          />

          <PersonalDetails
            user={user}
            isEditing={isEditing}
            onEditToggle={() => setIsEditing(true)}
            onSave={handleSave}
            onUserChange={handleUserChange}
          />

          <div className="grid grid-cols-2 md:grid-cols-2 gap-12 mt-25">
            <AccountInfo
              displayName={user.displayName}
              createdAt={user.createdAt}
              membership={user.membership}
            />
            <SecuritySettings
              settings={securitySettings}
              onToggle2FA={toggle2FA}
              onToggleLoginNotifications={toggleLoginNotifications}
              onChangeSecurityQuestion={handleChangeSecurityQuestion}
              onManageDevices={handleManageDevices}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;