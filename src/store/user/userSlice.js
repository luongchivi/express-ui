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
        sessionExpiredMessage: '',
    },
    reducers: {
        login: (state, action) => {
            state.isLogin = action.payload.isLogin;
            state.accessToken = action.payload.accessToken;
        },
        logout: (state, action) => {
            state.isLogin = false;
            state.isLoading = false;
            state.currentUser = null;
            state.accessToken = null;
            state.messageErrorAPI = null;
            state.sessionExpiredMessage = '';
        },
        clearSessionExpiredMessage: (state) => {
            state.sessionExpiredMessage = '';
        }
    },
    extraReducers: (builder) => {
        builder.addCase(actions.getCurrentUser.pending, (state) => {
            state.isLoading = true;
        });
        builder.addCase(actions.getCurrentUser.fulfilled, (state, action) => {
            state.isLoading = false;
            state.currentUser = action.payload;
            state.isLogin = true;
        });
        builder.addCase(actions.getCurrentUser.rejected, (state, action) => {
            state.isLoading = false;
            state.currentUser = null;
            state.isLogin = false;
            state.accessToken = null;
            state.messageErrorAPI = action.payload?.results.messageErrorAPI;
            state.sessionExpiredMessage = 'Your Session Has Expired! Please Login Again.'
        });
    }
});
export const { login, logout, clearSessionExpiredMessage } = userSlice.actions;

export default userSlice.reducer;
