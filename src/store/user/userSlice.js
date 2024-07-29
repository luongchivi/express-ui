import {createSlice} from "@reduxjs/toolkit";
import * as actions from "../user/asyncAction";


export const userSlice = createSlice({
    name: 'user',
    initialState: {
        isLogin: false,
        isLoading: false,
        currentUser: null,
        accessToken: null,
        messageErrorAPI: null,
    },
    reducers: {
        login: (state, action) => {
            state.isLogin = action.payload.isLogin;
            state.accessToken = action.payload.accessToken;
        },
        logout: (state, action) => {
            state.isLogin = false;
            state.accessToken = null;
        }
    },
    extraReducers: (builder) => {
        builder.addCase(actions.getCurrentUser.pending, (state) => {
            state.isLoading = true;
        });
        builder.addCase(actions.getCurrentUser.fulfilled, (state, action) => {
            state.isLoading = false;
            state.currentUser = action.payload;
        });
        builder.addCase(actions.getCurrentUser.rejected, (state, action) => {
            state.isLoading = false;
            state.currentUser = null;
            state.messageErrorAPI = action.payload?.results.messageErrorAPI;
        });
    }
});
export const { login, logout } = userSlice.actions;

export default userSlice.reducer;
