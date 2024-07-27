import {createSlice} from "@reduxjs/toolkit";


export const userSlice = createSlice({
    name: 'user',
    initialState: {
        isLogin: false,
        currentUser: null,
        token: null,
        messageErrorAPI: null,
    },
    reducers: {
        login: (state, action) => {
            state.isLogin = action.payload.isLogin;
            state.currentUser = action.payload.userData;
            state.token = action.payload.token;
        }
    },
});
export const { login } = userSlice.actions;

export default userSlice.reducer;
