import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isSaving: false,
  isRetrieving: false,
};

const loadingSlice = createSlice({
  name: 'loading',
  initialState,
  reducers: {
    setSaving: (state, action) => {
      state.isSaving = action.payload;
    },
    setRetrieving: (state, action) => {
      state.isRetrieving = action.payload;
    },
  },
});

export const { setSaving, setRetrieving } = loadingSlice.actions;
export default loadingSlice.reducer;