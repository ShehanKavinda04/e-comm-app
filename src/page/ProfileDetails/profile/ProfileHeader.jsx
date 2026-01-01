import { IconButton } from '@mui/material';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';

const ProfileHeader = ({ profilePic, fullName, email, role, onImageUpload }) => {
  return (
    <div className="flex flex-col md:flex-row items-start gap-6 mb-8">
      <div className="relative">
        <img
          src={profilePic}
          alt="Profile"
          className="w-40 h-40 rounded-full object-cover border-4 border-gray-200"
        />
        <label htmlFor="photo-upload">
          <IconButton
            component="span"
            sx={{
              position: 'absolute',
              bottom: 0,
              right: 0,
              backgroundColor: 'white',
              boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
              '&:hover': { backgroundColor: '#f0f0f0' },
            }}
          >
            <PhotoCameraIcon sx={{ color: '#1976d2' }} />
          </IconButton>
        </label>
        <input
          id="photo-upload"
          type="file"
          accept="image/*"
          onChange={onImageUpload}
          className="hidden"
        />
      </div>

      <div className="flex flex-col justify-center">
        <p className="text-black font-semibold text-2xl">{fullName}</p>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mt-2">
          <a href={`mailto:${email}`} className="text-blue-800 underline text-sm font-medium">
            {email}
          </a>
          <span className="text-gray-600 text-sm">— {role}</span>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;