import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { api_urls } from '../../config/api';

const api = api_urls.exchanges_coins;
const api_key = api_urls.api_key;

export const getCoinTickers = createAsyncThunk(
  'getCoinTickers',
  async ({ currentCoin, currentCurrency }) => {
    try {
      const response = await fetch(
        `${api}fsym=${currentCoin}&tsym=${currentCurrency}&api_key=${api_key}`,
      );
      const data = await response.json();
      return data.Data.Exchanges;
    } catch (error) {
      console.log(error, 'error');
    }
  },
);

const initialState = {
  data: [],
  loading: false,
  error: false,
};

const getCoinTickersSlice = createSlice({
  name: 'getCoinTickers',
  initialState,
  reducers: {
    clearCoinTickers: (state) => {
      state.data = [];
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getCoinTickers.fulfilled, (state, action) => {
      state.data = action.payload;
      state.loading = false;
      state.error = false;
    });
    builder.addCase(getCoinTickers.pending, (state, action) => {
      state.data = [];
      state.loading = true;
      state.error = false;
    });
    builder.addCase(getCoinTickers.rejected, (state, action) => {
      state.data = [];
      state.loading = false;
      state.error = true;
    });
  },
});

export const { clearCoinTickers } = getCoinTickersSlice.actions;
export default getCoinTickersSlice.reducer;
