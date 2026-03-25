import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
    accessToken: string | null;
    isAuthenticated: boolean;
}

const initialState: AuthState = {
    accessToken: localStorage.getItem('accessToken'),
    isAuthenticated: !!localStorage.getItem('accessToken'),
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setCredentials: (state, action: PayloadAction<{ accessToken: string }>) => {
            state.accessToken = action.payload.accessToken;
            state.isAuthenticated = true;
            localStorage.setItem('accessToken', action.payload.accessToken);
        },
        logOut: (state) => {
            state.accessToken = null;
            state.isAuthenticated = false;
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
        },
    },
});

export const authActions = authSlice.actions;
export const { setCredentials, logOut } = authSlice.actions;
export default authSlice.reducer;
