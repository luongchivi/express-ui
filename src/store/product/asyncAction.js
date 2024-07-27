import {createAsyncThunk} from "@reduxjs/toolkit";
import * as apis from "../../apis/product";


export const getNewProducts = createAsyncThunk('product/newProducts', async (data, {rejectWithValue}) => {
    const response = await apis.apiGetProducts({sortBy: 'id', sortOrder: 'desc'});
    const { statusCode, products } = response.results;
    if (statusCode !== 200) {
        return rejectWithValue(response);
    }
    return products;
});
