import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { authApi } from '../features/auth/services/authApi';
import authReducer from '../features/auth/slice/authSlice';
import notificationReducer from '../features/notifications/slice/notificationSlice';
import {cinemaApi} from "../features/cinema/services/cinemaApi.ts";

export const store = configureStore({
    reducer: {
        [authApi.reducerPath]: authApi.reducer,
        [cinemaApi.reducerPath]: cinemaApi.reducer,

        auth: authReducer,
        notification: notificationReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(authApi.middleware)
            .concat(cinemaApi.middleware),
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
