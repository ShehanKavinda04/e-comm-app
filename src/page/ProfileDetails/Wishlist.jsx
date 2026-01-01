import React, { useState, useEffect, useContext } from 'react'
import FavoriteIcon from '@mui/icons-material/Favorite';
import { IconButton } from '@mui/material';
import { AuthContext } from '../../Contexts/AuthContext';
import { getWishlist, removeFromWishlist } from '../../Services/MockDataService';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { cartActions } from '../../Store/ReduxSlice/cartSlice';

const Wishlist = () => {
  const { user } = useContext(AuthContext);
  const [wishlist, setWishlist] = useState([]);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (user) {
      // Fallback ID 1 for test user logic if user.id is missing in some contexts
      const items = getWishlist(user.id || 1);
      setWishlist(items);
    }
  }, [user]);

  const handleRemove = (itemId) => {
    const updatedList = removeFromWishlist(user?.id || 1, itemId);
    setWishlist(updatedList);
  };

  const handleAddToCart = (item) => {
    dispatch(cartActions.addToCart({
      id: item.id,
      title: item.name,
      imgUrl: item.image,
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
          key={item.id || index}
          item={item}
          onRemove={() => handleRemove(item.id)}
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
          <img src={item.image} alt={item.name} className="max-h-[200px] max-w-[90%] object-contain" />
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
          <p>{item.category || 'Product'}</p>
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