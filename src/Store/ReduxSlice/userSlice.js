import { createSelector, createSlice } from "@reduxjs/toolkit";

const initialState={
  user:{
    name:'default'
  }, 
}

const userSlice = createSlice({
  name:'userSlice',
  initialState,
  reducers:{

    addUser:(state,action)=>{
      state.user= action.payload    
    },
    // eslint-disable-next-line no-unused-vars
    removeUser:(state,action)=>{
      state.user= {}    
    },
  }
})
export const {addUser,removeUser} =userSlice.actions

export const userSelector = createSelector ([(Store)=>Store.user.user],(user)=>user)

export default userSlice.reducer   