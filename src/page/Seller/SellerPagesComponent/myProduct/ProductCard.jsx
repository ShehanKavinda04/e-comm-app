// src/components/ProductCard.jsx
import React from 'react';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import BorderColorIcon from '@mui/icons-material/BorderColor';

const ProductCard = ({ product, getStatusColor, onEdit, onView, onDelete }) => {
  const { name, price, stock, sold, status, image } = product;
  const isLowStock = stock < 10;
  const statusColor = getStatusColor(status);

  return (
    <div className="border-2 border-orange-700 rounded-md p-4 bg-white shadow-sm hover:shadow-md transition">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-5">
          <div className="w-24 h-24 border-2 border-gray-300 rounded-2xl overflow-hidden">
            <img src={image} alt={name} className="w-full h-full object-cover" />
          </div>
          <div className="flex flex-col justify-between">
            <div>
              <p className="text-black text-lg font-medium">{name}</p>
              <p className="text-black text-xl font-bold">Rs. {price.toLocaleString()}</p>
            </div>
            <div className="flex items-center gap-4 mt-3">
              <p className="text-sm text-gray-600">
                Stock: <span className={`font-medium ${isLowStock ? 'text-red-600' : ''}`}>{stock}</span>
              </p>
              <p className="text-sm text-gray-600">Sold: {sold}</p>
              <span className={`px-3 py-1 rounded-full text-white text-xs font-medium ${statusColor}`}>
                {status}
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <button
            onClick={() => onEdit(product)}
            className="border border-black flex items-center gap-2 px-4 py-1.5 rounded hover:bg-gray-50 transition cursor-pointer"
          >
            <BorderColorIcon sx={{ color: 'black', fontSize: 20 }} />
            <span className="text-black text-base">Edit</span>
          </button>

          <button
            onClick={() => onView(product)}
            className="border border-black flex items-center gap-2 px-4 py-1.5 rounded hover:bg-gray-50 transition cursor-pointer"
          >
            <VisibilityIcon sx={{ color: 'black', fontSize: 20 }} />
            <span className="text-black text-base font-medium">View</span>
          </button>

          <button
            onClick={() => onDelete(product)}
            className="border border-black flex items-center gap-2 px-4 py-1.5 rounded hover:bg-red-50 transition cursor-pointer"
          >
            <DeleteIcon sx={{ color: 'black', fontSize: 20 }} />
            <span className="text-red-600 text-base">Delete</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;