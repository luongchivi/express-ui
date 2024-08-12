import {createAsyncThunk} from "@reduxjs/toolkit";
import * as apis from "apis";


export const getCartMe = createAsyncThunk('cart/cartMe', async (data, {rejectWithValue}) => {
    const response = await apis.apiGetCartMe();
    const { statusCode, cart } = response.results;
    if (statusCode !== 200) {
        return rejectWithValue(response);
    }
    return cart;
});
