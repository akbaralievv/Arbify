import { configureStore } from '@reduxjs/toolkit';

import getCoins from './slices/getCoins';
import getExchanges from './slices/getExchanges';
import getCoinTickers from './slices/getCoinTickers';
import currentCoin from './slices/currentCoin';
import currentCurrency from './slices/currentCurrency';

export const store = configureStore({
  reducer: {
    getCoins,
    getExchanges,
    getCoinTickers,
    currentCoin,
    currentCurrency,
  },
});
