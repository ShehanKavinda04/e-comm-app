import { configureStore } from "@reduxjs/toolkit";
import categoryReducer from './categorySlice'
import userReducer from './userSlice'
import sellerReducer from './sellerSlice'
import cartReducer from './cartSlice'
import orderReducer from './orderSlice'

const store = configureStore({
  reducer: {
    category: categoryReducer,
    user: userReducer,
    seller: sellerReducer,
    cart: cartReducer,
    order: orderReducer
  }
})

export default store