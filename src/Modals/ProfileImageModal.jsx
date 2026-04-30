import React, { useState, useContext } from 'react';
import { Modal, Box, IconButton, Button, CircularProgress } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import DeleteIcon from '@mui/icons-material/Delete';
import { AuthContext } from '../Contexts/AuthContext';
import { updateUserProfile, deleteProfileImage } from '../Services/userService';
import { toast } from 'react-hot-toast';
import { API_BASE_URL } from '../Services/api';

const getImageUrl = (imagePath) => {
  if (!imagePath) return null;
  if (imagePath.startsWith('data:') || imagePath.startsWith('http')) return imagePath;
  const baseUrl = API_BASE_URL.replace('/api/', '');
  return `${baseUrl}/${imagePath}`;
};

const ProfileImageModal = ({ open, onClose }) => {
  const { user, refreshUser } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size should be less than 5MB");
        return;
      }
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    setLoading(true);
    try {
      const formData = new FormData();
      // Only send identifying data; phone/countryCode will be skipped if omitted
      formData.append('data', new Blob([JSON.stringify({ 
        fullName: user?.fullName || user?.name || user?.displayName,
        displayName: user?.displayName || user?.fullName || user?.name
      })], { type: 'application/json' }));
      formData.append('file', selectedFile);

      await updateUserProfile(formData);
      await refreshUser();
      toast.success('Profile image updated successfully!');
      setPreview(null);
      setSelectedFile(null);
      onClose();
    } catch (error) {
      console.error("Upload error:", error);
      toast.error(error.response?.data?.message || 'Failed to upload image');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    console.log("Starting profile image deletion...");
    setLoading(true);
    try {
      await deleteProfileImage();
      console.log("Delete API call successful, refreshing user...");
      await refreshUser();
      toast.success('Profile image removed successfully!');
      onClose();
    } catch (error) {
      console.error("Delete error details:", error);
      toast.error('Failed to remove image');
    } finally {
      setLoading(false);
    }
  };

  const handleModalClose = () => {
    if (!loading) {
      setPreview(null);
      setSelectedFile(null);
      onClose();
    }
  };

  return (
    <Modal 
      open={open} 
      onClose={handleModalClose} 
      aria-labelledby="profile-image-modal"
      closeAfterTransition
    >
      <Box className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-md bg-white rounded-xl shadow-2xl p-6 outline-none">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-800">Manage Profile Image</h2>
          <IconButton onClick={handleModalClose} size="small" disabled={loading}>
            <CloseIcon />
          </IconButton>
        </div>

        <div className="flex flex-col items-center gap-6">
          <div className="relative w-48 h-48 group">
            <div className="w-full h-full rounded-full overflow-hidden border-4 border-gray-100 shadow-inner bg-gray-50 flex items-center justify-center">
              {preview ? (
                <img src={preview} alt="Preview" className="w-full h-full object-cover animate-in fade-in duration-300" />
              ) : user?.image ? (
                <img 
                  key={user.image}
                  src={getImageUrl(user.image)} 
                  alt="Profile" 
                  className="w-full h-full object-cover" 
                  onError={(e) => {
                    console.log("Modal image load error, falling back");
                    e.target.onerror = null;
                    e.target.src = "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y";
                  }}
                />
              ) : (
                <PhotoCameraIcon sx={{ fontSize: 60, color: '#ccc' }} />
              )}
            </div>
            
            {loading && (
              <div className="absolute inset-0 bg-white/60 flex items-center justify-center rounded-full z-10">
                <CircularProgress size={40} sx={{ color: '#f75252' }} />
              </div>
            )}
          </div>

          <p className="text-sm text-gray-500 text-center px-4">
            Upload a clear photo to help your customers and the team recognize you.
          </p>

          <div className="w-full flex flex-col gap-3">
            <input
              type="file"
              id="navbar-photo-upload"
              hidden
              accept="image/*"
              onChange={handleFileChange}
              disabled={loading}
            />
            
            {!preview ? (
              <>
                <Button
                  variant="contained"
                  component="label"
                  htmlFor="navbar-photo-upload"
                  fullWidth
                  disabled={loading}
                  sx={{ 
                    bgcolor: '#f75252', 
                    '&:hover': { bgcolor: '#d43f3f' },
                    textTransform: 'none',
                    fontWeight: 'bold',
                    py: 1.5,
                    borderRadius: '8px',
                    boxShadow: 'none'
                  }}
                  startIcon={<PhotoCameraIcon />}
                >
                  {user?.image ? 'Change Photo' : 'Upload Photo'}
                </Button>
                
                {user?.image && (
                  <Button
                    variant="outlined"
                    color="error"
                    fullWidth
                    onClick={handleDelete}
                    disabled={loading}
                    sx={{ 
                      textTransform: 'none',
                      fontWeight: 'bold',
                      py: 1.5,
                      borderRadius: '8px',
                      borderWidth: '2px',
                      '&:hover': { borderWidth: '2px' }
                    }}
                    startIcon={<DeleteIcon />}
                  >
                    Remove Current Photo
                  </Button>
                )}
              </>
            ) : (
              <div className="flex gap-3 w-full">
                <Button
                  variant="contained"
                  className="flex-1"
                  onClick={handleUpload}
                  disabled={loading}
                  sx={{ 
                    bgcolor: '#4caf50', 
                    '&:hover': { bgcolor: '#388e3c' },
                    textTransform: 'none',
                    fontWeight: 'bold',
                    py: 1.5,
                    borderRadius: '8px',
                    boxShadow: 'none'
                  }}
                >
                  Save Changes
                </Button>
                <Button
                  variant="outlined"
                  className="flex-1"
                  onClick={() => { setPreview(null); setSelectedFile(null); }}
                  disabled={loading}
                  sx={{ 
                    color: '#666',
                    borderColor: '#ccc',
                    textTransform: 'none',
                    fontWeight: 'bold',
                    py: 1.5,
                    borderRadius: '8px'
                  }}
                >
                  Cancel
                </Button>
              </div>
            )}
          </div>
        </div>
      </Box>
    </Modal>
  );
};

export default ProfileImageModal;
