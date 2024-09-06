// frontend/src/redux/authSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { toast } from 'react-toastify';
const API_URL = import.meta.env.VITE_API_URL;

const initialState = {
  user: null,
  isSigningUp: false,
  checkingAuth: true,
  isLoggingOut: false,
  isLoggingIn: false,
  isEdittingUser: false,
};

export const signup = createAsyncThunk('auth/signup', async (credentials, { rejectWithValue }) => {
  try {
    const res = await axios.post(`${API_URL}/api/auth/signup`, credentials);
    toast.success('Signup successful!');
    localStorage.setItem('jwt-shoobpass', res.data.token);
    return res.data.user;
  } catch (error) {
    toast.error(error.response.data.message || 'Error in Signing up');
    return rejectWithValue(error.response.data.message);
  }
});

export const login = createAsyncThunk('auth/login', async (credentials, { rejectWithValue }) => {
  try {
    const res = await axios.post(`${API_URL}/api/auth/login`, credentials);
    localStorage.setItem('jwt-shoobpass', res.data.token);
    toast.success('Logged in successfully');
    return res.data.user;
  } catch (error) {
    toast.error(error.response.data.message || 'Error in logging in');
    return rejectWithValue(error.response.data.message);
  }
});


export const updateUser = createAsyncThunk('auth/updateUser', async (credentials, { rejectWithValue }) => {
  try {
    const res = await axios.put(`${API_URL}/api/auth/editUser`, credentials);
    toast.success('User updated successfully');
    return res.data.user;
  } catch (error) {
    toast.error(error.response.data.message || 'Error in updating user');
    return rejectWithValue(error.response.data.message);
  }
});


export const logout = createAsyncThunk('auth/logout', async (_, { rejectWithValue }) => {
  try {
    await axios.post(`${API_URL}/api/auth/logout`);
    toast.success('Logged out successfully');
    localStorage.removeItem('jwt-shoobpass');
    return null;
  } catch (error) {
    toast.error(error.response.data.message || 'Error in logging out');
    return rejectWithValue(error.response.data.message);
  }
});

export const getAuth = createAsyncThunk('auth/getAuth', async (_, { rejectWithValue }) => {
  try {
    const res = await axios.get(`${API_URL}/api/auth/getAuth`);
    console.log("user:",res.data.user);
    return res.data.user;
  } catch (error) {
    return rejectWithValue(error.response.data.message);
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(signup.pending, (state) => {
        state.isSigningUp = true;
      })
      .addCase(signup.fulfilled, (state, action) => {
        state.isSigningUp = false;
        state.user = action.payload;
      })
      .addCase(signup.rejected, (state) => {
        state.isSigningUp = false;
        state.user = null;
      })
      .addCase(login.pending, (state) => {
        state.isLoggingIn = true;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoggingIn = false;
        state.user = action.payload;
      })
      .addCase(login.rejected, (state) => {
        state.isLoggingIn = false;
        state.user = null;
      })
      .addCase(updateUser.pending, (state) => {
        state.isEdittingUser = true;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.isEdittingUser = false;
        state.user = action.payload;
      })
      .addCase(updateUser.rejected, (state) => {
        state.isEdittingUser = false;
      })
      .addCase(logout.pending, (state) => {
        state.isLoggingOut = true;
      })
      .addCase(logout.fulfilled, (state) => {
        state.isLoggingOut = false;
        state.user = null;
      })
      .addCase(logout.rejected, (state) => {
        state.isLoggingOut = false;
      })
      .addCase(getAuth.pending, (state) => {
        state.checkingAuth = true;
      })
      .addCase(getAuth.fulfilled, (state, action) => {
        state.checkingAuth = false;
        state.user = action.payload;
      })
      .addCase(getAuth.rejected, (state) => {
        state.checkingAuth = false;
        state.user = null;
      });
  },
});

export default authSlice.reducer;