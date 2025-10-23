import { createSlice } from "@reduxjs/toolkit";
import { createSelector } from 'reselect';

const initialState =[
  {
    id:'category1',
    title:'IPhone 14 Pro Max OLD Display Assemble'
  },
  {
    id:'category2',
    title:'IPhone 14 Pro Max OLD Display Assemble'
  },
]

const categorySlice = createSlice({
  name:'categorySlice',
  initialState,
  reducers:{}
})

export const categorySelector = createSelector([(store)=>store.category],(category)=>category)

export default categorySlice.reducer; 