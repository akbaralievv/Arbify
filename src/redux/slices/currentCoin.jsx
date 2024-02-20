import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

export const setCurrentCoinAsync = createAsyncThunk(
  'currentCoin/setCurrentCoin',
  async (coinId, { dispatch }) => {
    await chrome.storage.sync.set({ currentCoin: coinId });
    dispatch(setCurrentCoin(coinId));
  },
);

const initialState = {
  currentCoin: 'BTC',
};

const currentCoinSlice = createSlice({
  name: 'currentCoin',
  initialState,
  reducers: {
    setCurrentCoin: (state, action) => {
      state.currentCoin = action.payload;
    },
    clearCurrentCoin: (state) => {
      state.currentCoin = '';
    },
  },
});

export const { setCurrentCoin, clearCurrentCoin } = currentCoinSlice.actions;
export default currentCoinSlice.reducer;
