import {createSlice} from "@reduxjs/toolkit";
import * as actions from "./asyncAction";

export const productSlice = createSlice({
    name: 'product',
    initialState: {
        newProducts: [],
        isLoading: false,
        messageErrorAPI: null,
    },
    reducers: {
    },
    extraReducers: (builder) => {
        builder.addCase(actions.getNewProducts.pending, (state) => {
            state.isLoading = true;
        });
        builder.addCase(actions.getNewProducts.fulfilled, (state, action) => {
            state.isLoading = false;
            state.newProducts = action.payload;
        });
        builder.addCase(actions.getNewProducts.rejected, (state, action) => {
            state.isLoading = false;
            state.messageErrorAPI = action.payload?.results.messageErrorAPI;
        });
    },
});


export default productSlice.reducer;
