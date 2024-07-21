import {createAsyncThunk} from "@reduxjs/toolkit";
import * as apis from '../apis';


export const getCategories = createAsyncThunk('app/categories', async (data, {rejectWithValue}) => {
    const response = await apis.apiGetCategories();
    const { statusCode, categories } = response.results;
    if (statusCode !== 200) {
        return rejectWithValue(response);
    }
    return categories;
});
