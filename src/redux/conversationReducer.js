import { createSlice } from '@reduxjs/toolkit';
import {
  fetchConversations,
  fetchOneConversation,
  newConversation,
  sendNewMessage,
} from './actions.js';

/**
 * A slice for the conversations state in the Redux store.
 */
const conversationsSlice = createSlice({
  name: 'conversations',
  initialState: {
    conversationArray: [],
    messages: [],
    currentConversation: null,
    currentMessage: '',
    loading: false,
    error: null,
  },
  reducers: {
    setCurrentMessage: (state, action) => {
      state.currentMessage = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch items
      .addCase(fetchConversations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchConversations.fulfilled, (state, action) => {
        state.conversationArray = action.payload;
        state.loading = false;
      })
      .addCase(fetchOneConversation.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOneConversation.fulfilled, (state, action) => {
        state.loading = false;
        state.currentConversation = action.payload.conversation;
        state.messages = action.payload.messages;
      })
      .addCase(sendNewMessage.fulfilled, (state, action) => {
        state.messages = action.payload;
        state.currentMessage = '';
      })
      .addCase(newConversation.fulfilled, (state, action) => {
        state.currentConversation = action.payload.conversation;
        state.messages = action.payload.messages;
        if (action.payload.new) {
          state.conversationArray = [
            ...state.conversationArray,
            action.payload.conversation,
          ];
        }
      });
  },
});

export const { setCurrentMessage } = conversationsSlice.actions;

export default conversationsSlice.reducer;
