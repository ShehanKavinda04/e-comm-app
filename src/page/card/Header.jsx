import React from 'react';
import { IconButton, InputBase, Paper } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import MoreHorizOutlinedIcon from '@mui/icons-material/MoreHorizOutlined';
import SearchIcon from '@mui/icons-material/Search';
import { useNavigate } from 'react-router-dom';

const Header = ({ totalItems, searchQuery, setSearchQuery, filteredProducts, addToCart }) => {
  const navigate = useNavigate();

  return (
    <div className="w-full p-4 bg-amber-50 sticky top-0 z-10">
      <div className="flex items-center justify-between mb-3">
        <IconButton onClick={() => navigate(-1)}>
          <ArrowBackIcon sx={{ color: 'orange', fontSize: 25 }} />
        </IconButton>
        <h1 className="text-black text-2xl font-semibold">My Cart ({totalItems})</h1>
        <IconButton>
          <MoreHorizOutlinedIcon sx={{ color: 'orange', fontSize: 25 }} />
        </IconButton>
      </div>

      {/* Search Bar */}
      <Paper
        component="form"
        sx={{
          display: 'flex',
          alignItems: 'center',
          width: '100%',
          borderRadius: '50px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        }}
      >
        <IconButton sx={{ p: '10px' }}>
          <SearchIcon />
        </IconButton>
        <InputBase
          sx={{ ml: 1, flex: 1 }}
          placeholder="Search products..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </Paper>

      {/* Search Results Dropdown */}
      {searchQuery && (
        <div className="absolute left-4 right-4 mt-2 bg-white rounded-xl shadow-lg max-h-96 overflow-y-auto z-20 border border-gray-200">
          {filteredProducts.length === 0 ? (
            <p className="p-4 text-gray-500 text-center">No products found</p>
          ) : (
            filteredProducts.map((product) => (
              <div
                key={product.id}
                className="flex items-center justify-between gap-3 p-3 hover:bg-gray-100 cursor-pointer transition"
                onClick={() => addToCart(product)}
              >
                <div className="flex items-center gap-3">
                  <img
                    src={product.image}
                    alt={product.title}
                    className="w-12 h-12 object-cover rounded-lg"
                  />
                  <div>
                    <p className="font-semibold">{product.title}</p>
                    <p className="text-sm text-gray-600">Rs. {product.price.toLocaleString()}</p>
                  </div>
                </div>
                <button className="bg-orange-600 text-white px-4 py-1 rounded-full text-sm hover:bg-orange-700">
                  Add
                </button>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default Header;