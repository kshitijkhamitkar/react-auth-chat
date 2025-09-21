import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [
    {
      id: 1,
      message: 'Welcome to the chat application!',
      timestamp: new Date().toISOString(),
      read: false
    },
    {
      id: 2,
      message: 'Your account has been created successfully.',
      timestamp: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
      read: false
    }
  ]
};

const notificationSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    addNotification: (state, action) => {
      state.items.unshift(action.payload);
    },
    markAsRead: (state, action) => {
      const notification = state.items.find(item => item.id === action.payload);
      if (notification) {
        notification.read = true;
      }
    },
    markAllAsRead: (state) => {
      state.items.forEach(item => {
        item.read = true;
      });
    },
    clearNotifications: (state) => {
      state.items = [];
    }
  }
});

export const { addNotification, markAsRead, markAllAsRead, clearNotifications } = notificationSlice.actions;
export default notificationSlice.reducer;