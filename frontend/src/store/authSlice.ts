import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api, setToken } from '../services/api';

export interface User {
  _id: string;
  username: string;
  email: string;
}

const tokenKey = 'chat_token';

interface AuthState {
  user: User | null;
  token: string;
  loading: boolean;
  error: string;
}

const initialState: AuthState = {
  user: null,
  token: localStorage.getItem(tokenKey) || '',
  loading: false,
  error: '',
};

export const login = createAsyncThunk<{ user: User; token: string }, { email: string; password: string }>('auth/login', async (data, thunkAPI) => {
  try {
    const res = await api.post('/auth/login', data);
    localStorage.setItem(tokenKey, res.token);
    setToken(res.token);
    return { user: res.user, token: res.token };
  } catch (err: any) {
    return thunkAPI.rejectWithValue(err.message);
  }
});

export const register = createAsyncThunk<{ user: User; token: string }, { username: string; email: string; password: string }>('auth/register', async (data, thunkAPI) => {
  try {
    const res = await api.post('/auth/register', data);
    localStorage.setItem(tokenKey, res.token);
    setToken(res.token);
    return { user: res.user, token: res.token };
  } catch (err: any) {
    return thunkAPI.rejectWithValue(err.message);
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      state.user = null;
      state.token = '';
      localStorage.removeItem(tokenKey);
      setToken('');
    },
    setUser(state, action) {
      state.user = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = '';
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = '';
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { logout, setUser } = authSlice.actions;
export default authSlice.reducer;
