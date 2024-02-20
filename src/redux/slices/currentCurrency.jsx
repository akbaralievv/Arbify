import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

export const setCurrentCurrencyAsync = createAsyncThunk(
  'currentCurrency/setCurrentCurrency',
  async (currencyId, { dispatch }) => {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      if (tabs[0].url && tabs[0].url.startsWith('http')) {
        const url = tabs[0].url;
        const cookieName = 'currency';

        if (!url) {
          console.log(chrome.runtime.lastError.message);
          return;
        }

        chrome.cookies.set({
          url: url,
          name: cookieName,
          value: currencyId,
        });
      }
      dispatch(setCurrentCurrency(currencyId));
    });
  },
);

const initialState = {
  currentCurrency: 'USD',
};
const currentCurrencySlice = createSlice({
  name: 'currentCurrency',
  initialState,
  reducers: {
    setCurrentCurrency: (state, action) => {
      state.currentCurrency = action.payload;
    },
    clearCurrentCurrency: (state) => {
      state.currentCurrency = '';
    },
  },
});

export const { setCurrentCurrency, clearCurrentCurrency } = currentCurrencySlice.actions;
export default currentCurrencySlice.reducer;
