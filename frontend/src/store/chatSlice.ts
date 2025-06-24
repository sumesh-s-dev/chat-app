import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../services/api';

const initialState = {
  chats: [],
  messages: [],
  currentChatId: '',
  loading: false,
  error: '',
};

export const fetchChats = createAsyncThunk('chat/fetchChats', async (_, thunkAPI) => {
  try {
    return await api.get('/chat');
  } catch (err: any) {
    return thunkAPI.rejectWithValue(err.message);
  }
});

export const fetchMessages = createAsyncThunk('chat/fetchMessages', async (chatId, thunkAPI) => {
  try {
    return await api.get(`/message/${chatId}`);
  } catch (err: any) {
    return thunkAPI.rejectWithValue(err.message);
  }
});

export const sendMessage = createAsyncThunk('chat/sendMessage', async ({ chatId, content, type }, thunkAPI) => {
  try {
    return await api.post('/message', { chatId, content, type });
  } catch (err: any) {
    return thunkAPI.rejectWithValue(err.message);
  }
});

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setCurrentChatId(state, action) {
      state.currentChatId = action.payload;
      state.messages = [];
    },
    receiveMessage(state, action) {
      // Real-time message receive
      if (state.currentChatId === action.payload.chat) {
        state.messages.push(action.payload);
      }
    },
    clearChat(state) {
      state.currentChatId = '';
      state.messages = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchChats.pending, (state) => {
        state.loading = true;
        state.error = '';
      })
      .addCase(fetchChats.fulfilled, (state, action) => {
        state.loading = false;
        state.chats = action.payload;
      })
      .addCase(fetchChats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchMessages.pending, (state) => {
        state.loading = true;
        state.error = '';
      })
      .addCase(fetchMessages.fulfilled, (state, action) => {
        state.loading = false;
        state.messages = action.payload;
      })
      .addCase(fetchMessages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.messages.push(action.payload);
      });
  },
});

export const { setCurrentChatId, receiveMessage, clearChat } = chatSlice.actions;
export default chatSlice.reducer;
