import { configureStore } from '@reduxjs/toolkit';
import authReducer from './auth/authSlice.js';
import loadingReducer from './loading/loadingSlice.js';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    loading: loadingReducer,
  },
});