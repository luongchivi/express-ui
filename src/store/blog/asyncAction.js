import {createAsyncThunk} from "@reduxjs/toolkit";
import * as apis from 'apis';


export const getBlogs = createAsyncThunk('blog/blogs', async (data, {rejectWithValue}) => {
    const response = await apis.apiGetAllBlogs({pageSize: 8});
    const {statusCode, blogs} = response?.results;
    if (statusCode !== 200) {
        return rejectWithValue(response);
    }
    return blogs;
});
