import { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../../../Contexts/AuthContext';
import ProfileHeader from './ProfileHeader';
import PersonalDetails from './PersonalDetails';
import AccountInfo from './AccountInfo';
import SecuritySettings from './SecuritySettings';

const UserProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const { user: authUser, updateUserProfile } = useContext(AuthContext); // Get user and update function from context
  const [profilePic, setProfilePic] = useState(authUser?.image || "https://wallpaperaccess.com/full/1456546.jpg");

  const [user, setUser] = useState({
    fullName: authUser?.name || 'User Name',
    email: authUser?.email || 'user@example.com',
    address: 'No.12/A Thalangama, Koswatta', // Static for now as authUser might not have address
    phone: '+94712345678',
    nic: '2001145600553',
    role: authUser?.role || 'Buyer',
    createdAt: '2025-05-12',
    displayName: authUser?.name?.split(' ')[0] || 'User',
    membership: 'Premium Buyer',
  });

  // Effect to update local state if authUser changes (e.g. initial load)
  useEffect(() => {
    if (authUser) {
      setUser(prev => ({
        ...prev,
        fullName: authUser.name || prev.fullName,
        email: authUser.email || prev.email,
        role: authUser.role || prev.role,
        displayName: authUser.name ? authUser.name.split(' ')[0] : prev.displayName,
      }));
      if (authUser.image) setProfilePic(authUser.image);
    }
  }, [authUser]);

  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: true,
    loginNotifications: true,
    hasSecurityQuestion: true,
    connectedDevices: 2,
  });

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const newImage = reader.result;
        setProfilePic(newImage);
        // Sync with global auth state (Header)
        if (updateUserProfile) {
          updateUserProfile({ image: newImage });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    setIsEditing(false);
    console.log('Updated user:', user);
    // Sync with global auth state
    if (updateUserProfile) {
      updateUserProfile({
        name: user.fullName,
        email: user.email
      });
    }
  };

  const handleUserChange = (key, value) => {
    setUser(prev => ({ ...prev, [key]: value }));
  };

  const toggle2FA = () => setSecuritySettings(prev => ({ ...prev, twoFactorAuth: !prev.twoFactorAuth }));
  const toggleLoginNotifications = () => setSecuritySettings(prev => ({ ...prev, loginNotifications: !prev.loginNotifications }));
  const handleManageDevices = () => alert('Redirect to Connected Devices management page');
  const handleChangeSecurityQuestion = () => alert('Open modal to change security question');

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