import { configureStore } from "@reduxjs/toolkit";
import categoryReducer from './categorySlice'
import userReducer from './userSlice'

const store = configureStore({
  reducer: {
    category:categoryReducer, 
    user:userReducer
  }
})

export default store