import React, { useState, useEffect, useContext } from 'react'
import FavoriteIcon from '@mui/icons-material/Favorite';
import { IconButton } from '@mui/material';
import { AuthContext } from '../../Contexts/AuthContext';
import { getUserWishlist, removeFromWishlistBackend } from '../../Services/wishlistService';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../../Services/api';

import { useDispatch } from 'react-redux';
import { cartActions } from '../../Store/ReduxSlice/cartSlice';

const Wishlist = () => {
  const { user } = useContext(AuthContext);
  const [wishlist, setWishlist] = useState([]);
  const navigate = useNavigate();
  const dispatch = useDispatch();


  useEffect(() => {
    let intervalId;

    const fetchWishlist = async () => {
      if (user) {
        try {
          const items = await getUserWishlist();
          setWishlist(items);
        } catch (error) {
          console.error('Error fetching wishlist:', error);
        }
      }
    };

    fetchWishlist();

    // Poll every 5 seconds for real-time updates
    intervalId = setInterval(fetchWishlist, 5000);

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [user]);


  const handleRemove = async (productId) => {
    try {
      await removeFromWishlistBackend(productId);
      // Immediately reflect removal to make UI snappy natively before next poll
      setWishlist((prevList) => prevList.filter((i) => i.productId !== productId));
    } catch (error) {
      console.error('Error removing item from wishlist', error);
      alert('Failed to remove item. Please try again later.');
    }
  };

  const handleAddToCart = (item) => {
    dispatch(cartActions.addToCart({
      id: item.productId || item.id,
      title: item.name,
      imgUrl: item.imageFilename ? `${API_BASE_URL}/uploads/products/${item.imageFilename}` : (item.image || "https://images.unsplash.com/photo-1542291026-7eec264c27ff"),
      price: item.price
    }));
    // Optional: Navigate to cart or show success message
    //For now, we'll keep it simple as user asked for "click to add" work
    alert(`Added ${item.name} to Cart!`);
  };

  if (!user) {
    return <div className="text-center mt-10">Please log in to view your wishlist.</div>;
  }

  if (wishlist.length === 0) {
    return <div className="text-center mt-10 text-xl text-gray-500">Your wishlist is empty.</div>;
  }

  return (
    <div className='mt-5 px-4 flex flex-wrap justify-center gap-8 mb-10'>
      {wishlist.map((item, index) => (
        <CategoryItem
          key={item.id || item.productId || index}
          item={item}
          onRemove={() => handleRemove(item.productId)}
          onAddToCart={() => handleAddToCart(item)}
        />
      ))}
    </div>
  )
}

export default Wishlist

const CategoryItem = ({ item, onRemove, onAddToCart }) => {
  return (

    <div className='bg-amber-50 w-[280px]  h-[420px] shadow-md flex flex-col items-center justify-between pb-4 rounded-lg overflow-hidden'>
      <div className='w-full'>
        <div className='w-full py-2 flex justify-center relative bg-white h-[220px] items-center'>
          <img 
            src={item.imageFilename ? `${API_BASE_URL}/uploads/products/${item.imageFilename}` : (item.image || "https://images.unsplash.com/photo-1542291026-7eec264c27ff")} 
            alt={item.name} 
            className="max-h-[200px] max-w-[90%] object-contain" 
          />
          <FavoriteIcon
            onClick={onRemove}
            sx={{
              color: "red",
              marginTop: "5px",
              top: "10px",
              right: "10px",
              fontSize: "30px",
              padding: "0",
              position: "absolute",
              cursor: "pointer",
              transition: "transform 0.2s",
              ":hover": {
                transform: "scale(1.1)",
              }
            }} />
        </div>
        <div className='flex justify-between px-4 mt-3 text-gray-500 text-xs font-semibold uppercase tracking-wide'>
          <p>{item.categoryName || item.category || 'Product'}</p>
          <p>In Stock</p>
        </div>
        <p className='px-4 mt-1 mb-1 text-lg font-bold text-gray-800 leading-tight line-clamp-2 h-[50px]'>{item.name}</p>
        <div className='px-4 mt-2'>
          <p className='text-orange-600 text-xl font-bold'>Rs. {item.price}</p>
        </div>
      </div>
      <div>
        <button
          onClick={onAddToCart}
          className='bg-orange-600 text-white font-semibold py-2 w-[245px] rounded-lg hover:bg-orange-700 transition-colors shadow-sm' >
          Add to Cart
        </button>
      </div>
    </div>
  )
}