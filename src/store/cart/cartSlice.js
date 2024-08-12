import { createSlice } from '@reduxjs/toolkit';
import * as actions from "./asyncAction";


const cartSlice = createSlice({
    name: 'cart',
    initialState: {
        items: [],
        totalItems: 0,
        totalPrice: 0,
    },
    reducers: {
        updateCart(state, action) {
            state.items = action.payload.items;
            state.totalItems = action.payload.items.length;
            state.totalPrice = action.payload.totalPrice;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(actions.getCartMe.fulfilled, (state, action) => {
            state.items = action.payload.items;
            state.totalItems = action.payload.items.length;
            state.totalPrice = action.payload.totalPrice;
        });
    },
});

export const { updateCart } = cartSlice.actions;

export default cartSlice.reducer;
