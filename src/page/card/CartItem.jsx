import React from 'react';
import { IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';

const CartItem = ({ id, image, title, subtitle, price, quantity, updateQuantity, removeItem }) => {
  const handleQuantityChange = (e) => {
    const newQty = parseInt(e.target.value, 10);
    if (!isNaN(newQty) && newQty >= 1) {
      updateQuantity(id, newQty - quantity);
    }
  };

  const handleRemove = () => {
    // Immediate removal to fix "not working" issue
    removeItem(id);
  };

  const itemTotal = price * quantity;

  return (
    <div
      data-item-id={id}
      className="flex items-center justify-between bg-white rounded-2xl m-4 p-4 border border-orange-500 shadow-sm transition-all duration-300 hover:shadow-lg"
    >
      <div className="flex gap-4 flex-1">
        <div className="w-24 h-24 flex-shrink-0 rounded-xl overflow-hidden border border-gray-200">
          <img src={image} alt={title} className="w-full h-full object-cover" />
        </div>

        <div className="flex flex-col justify-between flex-1">
          <div>
            <p className="font-semibold text-lg">{title}</p>
            <p className="text-sm text-gray-600">{subtitle}</p>
          </div>
          <p className="text-xl font-bold text-black">Rs. {itemTotal.toLocaleString()}</p>
          {quantity > 1 && (
            <p className="text-sm text-gray-500">Unit price: Rs. {price.toLocaleString()}</p>
          )}
        </div>
      </div>

      <div className="flex flex-col items-end gap-5">
        <div className="flex items-center gap-2">
          <IconButton
            size="small"
            onClick={() => updateQuantity(id, -1)}
            disabled={quantity === 1}
            className="hover:bg-gray-200 transition"
          >
            <div className="bg-gray-100 rounded-full px-2 py-1">
              <RemoveIcon fontSize="small" />
            </div>
          </IconButton>

          <div className="bg-gray-100 rounded-full px-2 py-1 border border-orange-500">
            <input
              type="number"
              min="1"
              value={quantity}
              onChange={handleQuantityChange}
              className="w-12 text-center bg-transparent border-0 font-semibold text-lg focus:outline-none focus:ring-2 focus:ring-orange-500 rounded"
            />
          </div>

          <IconButton
            size="small"
            onClick={() => updateQuantity(id, 1)}
            className="hover:bg-gray-200 transition"
          >
            <div className="bg-gray-100 rounded-full px-2 py-1">
              <AddIcon fontSize="small" />
            </div>
          </IconButton>
        </div>

        <IconButton
          onClick={handleRemove}
          className="text-red-600 hover:bg-red-50 transition"
          size="medium"
          title="Remove item"
        >
          <DeleteOutlineOutlinedIcon sx={{ fontSize: 32, color: 'red' }} />
        </IconButton>
      </div>
    </div>
  );
};

export default CartItem;