import {createSlice} from "@reduxjs/toolkit";
import * as actions from "./asyncAction";


export const blogSlice = createSlice({
    name: 'blog',
    initialState: {
        blogs: [],
        messageErrorAPI: null,
    },
    reducers: {
    },
    extraReducers: (builder) => {
        builder.addCase(actions.getBlogs.pending, (state) => {
            state.isLoading = true;
        });
        builder.addCase(actions.getBlogs.fulfilled, (state, action) => {
            state.isLoading = false;
            state.blogs = action.payload;
        });
        builder.addCase(actions.getBlogs.rejected, (state, action) => {
            state.isLoading = false;
            state.messageErrorAPI = action.payload?.results.messageErrorAPI;
        });
    },
});


export default blogSlice.reducer;
