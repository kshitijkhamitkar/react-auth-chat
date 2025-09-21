import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  chats: [
    {
      id: 1,
      title: 'General Chat',
      lastMessage: 'Welcome to the chat!',
      timestamp: new Date().toISOString()
    }
  ],
  activeChat: 1,
  messages: [
    {
      id: 1,
      text: 'Welcome to the chat application! How can I help you today?',
      timestamp: new Date().toISOString(),
      sender: 'ai'
    }
  ]
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    selectChat: (state, action) => {
      state.activeChat = action.payload;
    },
    addMessage: (state, action) => {
      state.messages.push(action.payload);
    },
    addChat: (state, action) => {
      state.chats.push(action.payload);
      state.activeChat = action.payload.id;
    },
    clearMessages: (state) => {
      state.messages = [];
    }
  }
});

export const { selectChat, addMessage, addChat, clearMessages } = chatSlice.actions;
export default chatSlice.reducer;