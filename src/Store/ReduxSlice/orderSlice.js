import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    orders: [],
};

const orderSlice = createSlice({
    name: 'order',
    initialState,
    reducers: {
        addOrder(state, action) {
            const newOrder = action.payload;
            state.orders.unshift(newOrder); // Add to beginning of array
        },
        // We can add actions for updating status if needed later
    },
});

export const orderActions = orderSlice.actions;
export default orderSlice.reducer;
