import {createAsyncThunk} from "@reduxjs/toolkit";
import * as apis from "apis";


export const getWishlists = createAsyncThunk('user/wishlists', async (data, {rejectWithValue}) => {
    const response = await apis.apiGetAllProductsInWishlistOfUser();
    const { statusCode, wishlists } = response.results;
    if (statusCode !== 200) {
        return rejectWithValue(response);
    }
    return wishlists;
});
