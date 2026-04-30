import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import NotificationsIcon from '@mui/icons-material/Notifications';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { IconButton } from '@mui/material';
import { useState, useContext, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../Contexts/AuthContext';
import { useSelector } from 'react-redux';
import { getProducts } from '../Services/MockDataService'; // Import Data Service
import { getUserNotifications, markNotificationAsReadBackend, markAllNotificationsAsReadBackend } from '../Services/notificationService';
import { useNotification } from '../Contexts/NotificationContext';

const isRealToken = () => {
  const token = localStorage.getItem('token');
  return !!token && token.length > 20;
};
import LogoutModal from './LogoutModal';
import ProfileImageModal from '../Modals/ProfileImageModal';
import { API_BASE_URL } from '../Services/api';

const getImageUrl = (imagePath) => {
  if (!imagePath) return null;
  if (imagePath.startsWith('data:') || imagePath.startsWith('http')) return imagePath;
  // Prepend base URL but remove /api/ if it exists in the base to point to the server root /uploads
  const baseUrl = API_BASE_URL.replace('/api/', '');
  return `${baseUrl}/${imagePath}`;
};

// ...

// Header Component
const Header = ({ darkModalRef }) => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isSearch, setIsSearch] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);

  const { notifications, unreadCount, markRead, markAllRead } = useNotification();

  // Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [allProducts, setAllProducts] = useState([]);

  const totalQuantity = useSelector((state) => state.cart?.totalQuantity || 0);

  const userMenuRef = useRef(null);
  const notificationRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    // Load products on mount
    setAllProducts(getProducts());
  }, []);

  const handleLogoutClick = () => {
    setShowUserMenu(false);
    setShowLogoutConfirm(true);
  };

  const confirmLogout = () => {
    logout();
    setShowLogoutConfirm(false);
    navigate('/');
  };

  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query.trim() === '') {
      setSearchResults([]);
    } else {
      const filtered = allProducts.filter(product =>
        (product.title || product.name || '').toLowerCase().includes(query.toLowerCase()) ||
        (product.category || '').toLowerCase().includes(query.toLowerCase())
      );
      setSearchResults(filtered.slice(0, 5)); // Limit to 5 results
    }
  };

  const handleProductClick = (product) => {
    setSearchQuery(''); // Clear search
    setSearchResults([]);
    // Navigate to product detail
    // Using a generic logic: /category/{category}/{id}
    const categoryPath = (product.category || 'general').toLowerCase().replace(/\s+/g, '-');
    navigate(`/category/${categoryPath}/${product.id}`);
  }

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleNotificationClick = async (id) => {
    markRead(id);
  };



  const handleProfileClick = () => {
    if (user.role === 'SELLER') {
      navigate('/seller/dashboard');
    } else if (user.role === 'ADMIN') {
      navigate('/admin');
    } else {
      navigate('/profile');
    }
    setShowUserMenu(false);
  };

  const handleImageSearch = () => {
    fileInputRef.current.click();
  }

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      alert(`Image Search: Searching for products similar to "${e.target.files[0].name}"...`);
    }
  }

  return (
    <div className='sticky top-0 left-0 z-[100] w-full py-3 px-2 sm:px-6 md:px-10 flex justify-between items-center bg-[#f75252] shadow-md mb-[15px]'>
      {/* ----------------------Header left--------------------- */}
      <div>
        <Link to="/">
          <p className='text-3xl font-bold text-white cursor-pointer'>TECH NOVA</p>
        </Link>
        <p style={{
          display: window.innerWidth < 640 ? isSearch ? "none" : "inline-block" : "inline-block"
        }} className='text-sm font-medium text-gray-100'>Mobile & Laptop Parts</p>
      </div>

      {/* ----------------------Header mid (Search)-------------- */}
      <div className='relative flex items-center gap-3 border p-2 rounded-md bg-white'>
        <div className='flex items-center gap-2 w-full'>
          <IconButton className="cursor-pointer" onClick={() => { if (window.innerWidth < 640) { setIsSearch(!isSearch) } }}>
            <SearchOutlinedIcon sx={{ color: '#f75252' }} />
          </IconButton>
          <input
            className='outline-none text-black w-[150px] sm:w-[300px] font-sans'
            style={{
              display: window.innerWidth < 640 ? isSearch ? "inline-block" : "none" : "inline-block"
            }}
            placeholder='Search products...'
            type="text"
            value={searchQuery}
            onChange={handleSearch}
          />
        </div>
        <div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />
          <IconButton className="cursor-pointer" onClick={handleImageSearch} title="Search by Image">
            <PhotoCameraIcon sx={{ color: '#f75252' }} />
          </IconButton>
        </div>

        {/* Search Results Dropdown */}
        {searchQuery && (
          <div className="absolute top-full left-0 w-full bg-white shadow-xl rounded-b-md z-50 mt-1 max-h-96 overflow-y-auto border border-gray-100">
            {searchResults.length > 0 ? (
              searchResults.map((product) => (
                <div
                  key={product.id}
                  onClick={() => handleProductClick(product)}
                  className="flex items-center gap-3 p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-50 transition-colors"
                >
                  <img src={product.image || product.imgUrl} alt={product.title} className="w-10 h-10 object-cover rounded" />
                  <div>
                    <p className="text-sm font-semibold text-gray-800 line-clamp-1">{product.title || product.name}</p>
                    <p className="text-xs text-gray-500">{product.category}</p>
                  </div>
                  <span className="ml-auto text-xs font-bold text-red-500">
                    Rs. {product.price ? product.price.toLocaleString() : 'N/A'}
                  </span>
                </div>
              ))
            ) : (
              <div className="p-4 text-center text-sm text-gray-500">No products found</div>
            )}
          </div>
        )}
      </div>

      {/* --------------Header right----------- */}
      <div>
        <div className='flex items-center space-x-4 sm:space-x-6'>
          {/* Catalog Navigation */}
          <Link to="/category" className='font-medium text-white hidden sm:block cursor-pointer hover:underline'>
            Catalog
          </Link>

          <div style={{
            display: window.innerWidth < 640 ? isSearch ? "none" : "flex" : "flex"
          }} className='flex items-center gap-2 mr-0'>

            <div className='relative flex items-center gap-1 sm:gap-2'>
              {/* Notifications */}
              <div className="relative" ref={notificationRef}>
                <IconButton className="cursor-pointer" onClick={() => setShowNotifications(!showNotifications)}>
                  <NotificationsIcon sx={{ color: "white", fontSize: 28 }} />
                </IconButton>
                <div className='absolute top-1 right-1 rounded-full w-4 h-4 bg-white text-[#f75252] font-bold text-[10px] flex items-center justify-center border border-[#f75252]'>
                  {unreadCount}
                </div>

                {/* Notifications Dropdown */}
                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-72 bg-white rounded-md shadow-lg py-2 z-50 overflow-hidden">
                    <div className="px-4 py-2 bg-gray-50 border-b flex justify-between items-center">
                      <h3 className="font-bold text-gray-800 text-sm">Notifications</h3>
                      <span
                        onClick={markAllRead}
                        className="text-xs text-blue-500 cursor-pointer hover:underline">
                        Mark all as read
                      </span>
                    </div>
                    <div className="max-h-80 overflow-y-auto">
                      {notifications.length > 0 ? (
                        notifications.map(notification => (
                          <div
                            key={notification.id}
                            onClick={() => handleNotificationClick(notification.id)}
                            className={`px-4 py-3 border-b hover:bg-gray-50 cursor-pointer flex flex-col gap-1 ${notification.unread ? 'bg-blue-50/30' : ''}`}
                          >
                            <div className="flex justify-between items-start">
                              <p className="text-sm font-semibold text-gray-800">{notification.title}</p>
                              <span className="text-[10px] text-gray-400 whitespace-nowrap">{notification.time}</span>
                            </div>
                            <p className="text-xs text-gray-600 line-clamp-2">{notification.description}</p>
                          </div>
                        ))
                      ) : (
                        <div className="px-4 py-8 text-center text-gray-500 italic">No notifications</div>
                      )}
                    </div>
                    <Link to="/profile/notifications" onClick={() => setShowNotifications(false)}>
                      <div className="px-4 py-2 text-center text-xs text-blue-600 font-medium hover:bg-gray-50 border-t">
                        View All Notifications
                      </div>
                    </Link>
                  </div>
                )}
              </div>

              {/* Shopping Cart */}
              <Link to="/myCart">
                <div className="relative">
                  <IconButton className="cursor-pointer">
                    <ShoppingCartIcon sx={{ color: "white", fontSize: 28 }} />
                  </IconButton>
                  {totalQuantity > 0 && (
                    <div className='absolute top-1 right-1 rounded-full w-4 h-4 bg-white text-[#f75252] font-bold text-[10px] flex items-center justify-center border border-[#f75252]'>
                      {totalQuantity}
                    </div>
                  )}
                </div>
              </Link>

              {/* User Account */}
              <div className="relative" ref={userMenuRef}>
                {user ? (
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center gap-2 focus:outline-none cursor-pointer"
                  >
                    {user.image ? (
                      <div className="w-8 h-8 rounded-full border-2 border-white overflow-hidden bg-gray-200">
                        <img 
                          key={user.image} // Force re-render when image URL changes
                          src={getImageUrl(user.image)} 
                          alt="User" 
                          className="w-full h-full object-cover" 
                          onError={(e) => { 
                            console.log("Navbar image load error, falling back");
                            e.target.onerror = null; 
                            e.target.src = "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y";
                          }}
                        />
                      </div>
                    ) : (
                      <AccountCircleIcon sx={{ color: "white", fontSize: 32 }} />
                    )}
                  </button>
                ) : (
                  <IconButton className="cursor-pointer" onClick={() => darkModalRef.current.handleOpen()}>
                    <AccountCircleIcon sx={{ color: "white", fontSize: 30 }} />
                  </IconButton>
                )}

                {/* Dropdown Menu */}
                {showUserMenu && user && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                    <div className="px-4 py-2 text-sm text-gray-700 border-b">
                      <p className="font-semibold">{user.name || "User"}</p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                    {user.role !== 'BUYER' && (
                      <button
                        onClick={() => { setShowImageModal(true); setShowUserMenu(false); }}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Manage Profile Image
                      </button>
                    )}
                    <button
                      onClick={handleProfileClick}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      {user.role === 'SELLER' ? 'Seller Dashboard' : user.role === 'ADMIN' ? 'Admin Panel' : 'My Profile'}
                    </button>
                    <button
                      onClick={handleLogoutClick}
                      className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      {/* Profile Image Management Modal */}
      <ProfileImageModal 
        open={showImageModal} 
        onClose={() => setShowImageModal(false)} 
      />

      <LogoutModal
        isOpen={showLogoutConfirm}
        onClose={() => setShowLogoutConfirm(false)}
        onConfirm={confirmLogout}
      />
    </div>
  )
}
export default Header;