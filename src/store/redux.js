import {configureStore} from '@reduxjs/toolkit';
import appSlice from "store/app/appSlice";
import productSlice from "store/product/productSlice";
import storage from 'redux-persist/lib/storage';
import userSlice from 'store/user/userSlice';
import cartSlice from 'store/cart/cartSlice';
import blogSlice from "store/blog/blogSlice";
import wishlistSlice from "store/wishlist/wishlistSlice";
import {
    persistStore,
    persistReducer,
    FLUSH,
    REHYDRATE,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER,
} from 'redux-persist'


const commonConfig = {
    key: 'shop/user',
    storage
};

const userConfig = {
    ...commonConfig,
    whitelist: ['isLogin', 'accessToken', 'currentUser']
};

export const redux = configureStore({
    reducer: {
        app: appSlice,
        blog: blogSlice,
        products: productSlice,
        cart: cartSlice,
        wishlist: wishlistSlice,
        user: persistReducer(userConfig, userSlice)
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
            },
        }),
});

export const persistor =  persistStore(redux);
