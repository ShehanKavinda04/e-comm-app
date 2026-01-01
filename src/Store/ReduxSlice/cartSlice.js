import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    cartItems: [],
    totalQuantity: 0,
    totalAmount: 0,
};

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addToCart(state, action) {
            const newItem = action.payload;
            const existingItem = state.cartItems.find((item) => item.id === newItem.id);

            // Use quantity from payload or default to 1
            const quantityToAdd = newItem.quantity || 1;
            state.totalQuantity += quantityToAdd;

            // Clean price string if it comes as "12,500" or similar
            const price = typeof newItem.price === 'string'
                ? parseFloat(newItem.price.replace(/,/g, ''))
                : newItem.price;

            state.totalAmount += price * quantityToAdd;

            if (!existingItem) {
                state.cartItems.push({
                    id: newItem.id,
                    title: newItem.title,
                    image: newItem.imgUrl,
                    price: price,
                    quantity: quantityToAdd,
                    totalPrice: price * quantityToAdd,
                });
            } else {
                existingItem.quantity += quantityToAdd;
                existingItem.totalPrice += price * quantityToAdd;
            }
        },
        removeFromCart(state, action) {
            const id = action.payload;
            const existingItem = state.cartItems.find((item) => item.id === id);

            if (existingItem) {
                state.totalQuantity--;
                state.totalAmount -= existingItem.price;

                if (existingItem.quantity === 1) {
                    state.cartItems = state.cartItems.filter((item) => item.id !== id);
                } else {
                    existingItem.quantity--;
                    existingItem.totalPrice -= existingItem.price;
                }
            }
        },
        deleteFromCart(state, action) {
            const id = action.payload;
            const existingItem = state.cartItems.find((item) => item.id === id);

            if (existingItem) {
                state.totalQuantity -= existingItem.quantity;
                state.totalAmount -= existingItem.totalPrice;
                state.cartItems = state.cartItems.filter((item) => item.id !== id);
            }
        },
        clearCart(state) {
            state.cartItems = [];
            state.totalQuantity = 0;
            state.totalAmount = 0;
        },
    },
});

export const cartActions = cartSlice.actions;
export default cartSlice.reducer;
