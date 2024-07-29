import {configureStore} from '@reduxjs/toolkit';
import appSlice from "./app/appSlice";
import productSlice from "./product/productSlice";
import storage from 'redux-persist/lib/storage';
import { persistReducer, persistStore } from 'redux-persist';
import userSlice from '../store/user/userSlice';


const commonConfig = {
    key: 'shop/user',
    storage
};

const userConfig = {
    ...commonConfig,
    whitelist: ['isLogin', 'accessToken']
};

export const redux = configureStore({
    reducer: {
        app: appSlice,
        products: productSlice,
        user: persistReducer(userConfig, userSlice)
    },
});

export const persistor =  persistStore(redux);
