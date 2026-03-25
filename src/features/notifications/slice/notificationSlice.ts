import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface NotificationState {
    isOpen: boolean;
    message: string;
    type: 'error' | 'success' | 'info';
}

const initialState: NotificationState = {
    isOpen: false,
    message: '',
    type: 'info',
};

const notificationSlice = createSlice({
    name: 'notification',
    initialState,
    reducers: {
        showNotification: (state, action: PayloadAction<{ message: string; type?: 'error' | 'success' | 'info' }>) => {
            state.isOpen = true;
            state.message = action.payload.message;
            state.type = action.payload.type || 'info';
        },
        hideNotification: (state) => {
            state.isOpen = false;
        },
    },
});

export const { showNotification, hideNotification } = notificationSlice.actions;
export default notificationSlice.reducer;
