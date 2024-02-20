import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { api_urls } from '../../config/api';

const api = api_urls.coins;

export const getCoins = createAsyncThunk('getCoins', async () => {
  try {
    const response = await fetch(api, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        x_cg_pro_api_key: 'CG-iNL2Hyq4epG7TwxMUznL4ezY',
      },
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error, 'error');
  }
});

const initialState = {
  data: [],
  loading: false,
  error: false,
};

const getCoinsSlice = createSlice({
  name: 'getCoins',
  initialState,
  extraReducers: (builder) => {
    builder.addCase(getCoins.fulfilled, (state, action) => {
      state.data = action.payload;
      state.loading = false;
      state.error = false;
    });
    builder.addCase(getCoins.pending, (state, action) => {
      state.data = [];
      state.loading = true;
      state.error = false;
    });
    builder.addCase(getCoins.rejected, (state, action) => {
      state.data = [];
      state.loading = false;
      state.error = true;
    });
  },
});

export default getCoinsSlice.reducer;
