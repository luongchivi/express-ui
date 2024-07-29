import {createAsyncThunk} from "@reduxjs/toolkit";
import * as apis from "../../apis";


export const getCurrentUser = createAsyncThunk('user/currentUser', async (data, {rejectWithValue}) => {
    const response = await apis.apiCurrentUser();
    console.log(response);
    const { statusCode, user } = response.results;
    if (statusCode !== 200) {
        return rejectWithValue(response);
    }
    return user;
});
