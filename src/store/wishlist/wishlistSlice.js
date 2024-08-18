import {createSlice} from "@reduxjs/toolkit";
import * as actions from "../wishlist/asyncAction";


export const wishlistSlice = createSlice({
    name: 'wishlist',
    initialState: {
        wishlists: [],
        messageErrorAPI: null,
    },
    reducers: {

    },
    extraReducers: (builder) => {
        builder.addCase(actions.getWishlists.pending, (state) => {
            state.isLoading = true;
        });
        builder.addCase(actions.getWishlists.fulfilled, (state, action) => {
            state.isLoading = false;
            state.wishlists = action.payload;
        });
        builder.addCase(actions.getWishlists.rejected, (state, action) => {
            state.isLoading = false;
            state.messageErrorAPI = action.payload?.results.messageErrorAPI;
        });
    }
});


export default wishlistSlice.reducer;
