import * as React from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { useDispatch, useSelector } from 'react-redux';

import styles from './SelectCoins.module.css';
import { getCoins } from '../../redux/slices/getCoins';
import {
  setCurrentCoin,
  clearCurrentCoin,
  setCurrentCoinAsync,
} from '../../redux/slices/currentCoin';

export default function SelectCoins() {
  const { data } = useSelector((state) => state.getCoins);
  const { currentCoin } = useSelector((state) => state.currentCoin);

  const dispatch = useDispatch();

  React.useEffect(() => {
    dispatch(getCoins());
  }, [dispatch]);

  React.useEffect(() => {
    if (data.length > 0) {
      chrome.storage.sync.get(['currentCoin'], (result) => {
        if (result.currentCoin && data.some((coin) => coin.symbol === result.currentCoin)) {
          dispatch(setCurrentCoin(result.currentCoin));
        } else {
          dispatch(setCurrentCoin(data[0].symbol));
        }
      });
    }
  }, [data, dispatch]);

  const handleChange = (event) => {
    dispatch(clearCurrentCoin());
    dispatch(setCurrentCoinAsync(event.target.value));
  };

  return (
    <div className={styles.coins}>
      <Box sx={{ minWidth: 120, marginBottom: '15px' }}>
        <FormControl fullWidth>
          <InputLabel id="demo-simple-select-label">Coins</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={currentCoin}
            label="Age"
            onChange={handleChange}>
            {data?.map((coin) => (
              <MenuItem value={coin.symbol}>
                <div className={styles.coin}>
                  <img src={coin.image} alt="coin" />
                  <p>
                    {coin.name} ({coin.symbol?.toUpperCase()})
                  </p>
                </div>
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
    </div>
  );
}
