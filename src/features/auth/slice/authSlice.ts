import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { type UserResponseDto } from '../types/types';

interface AuthState {
    user: UserResponseDto | null;
    isAuthenticated: boolean;
    isInitialized: boolean;
}

const initialState: AuthState = {
    user: null,
    isAuthenticated: false,
    isInitialized: false,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setCredentials: (state, action: PayloadAction<UserResponseDto>) => {
            state.user = action.payload;
            state.isAuthenticated = true;
            state.isInitialized = true;
        },
        logOut: (state) => {
            state.user = null;
            state.isAuthenticated = false;
            state.isInitialized = true;
        }
    },
});

export const { setCredentials, logOut } = authSlice.actions;
export default authSlice.reducer;
