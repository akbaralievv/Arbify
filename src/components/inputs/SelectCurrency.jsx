import * as React from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { useDispatch, useSelector } from 'react-redux';

import styles from './SelectCurrency.module.css';
import usd from '../../assets/dollar-symbol.png';
import euro from '../../assets/euro.png';
import tether from '../../assets/tether.png';

import {
  setCurrentCurrency,
  clearCurrentCurrency,
  setCurrentCurrencyAsync,
} from '../../redux/slices/currentCurrency';

export default function SelectCurrency() {
  const { currentCurrency } = useSelector((state) => state.currentCurrency);
  const data = [
    { code: 'USD', name: 'US Dollar', img: usd },
    { code: 'EUR', name: 'Euro', img: euro },
    { code: 'USDT', name: 'Tether', img: tether },
  ];

  const dispatch = useDispatch();

  React.useEffect(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      const url = tabs[0]?.url;
      if (url && url.startsWith('http')) {
        chrome.cookies.get({ url: url, name: 'currency' }, function (cookie) {
          if (cookie && cookie.value) {
            dispatch(setCurrentCurrency(cookie.value));
          }
        });
      }
    });
  }, []);

  const handleChange = (event) => {
    dispatch(clearCurrentCurrency());
    dispatch(setCurrentCurrencyAsync(event.target.value));
  };

  return (
    <div className={styles.currencys}>
      <Box sx={{ minWidth: 120, marginBottom: '15px' }}>
        <FormControl fullWidth>
          <InputLabel id="demo-simple-select-label">Currencys</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={currentCurrency}
            label="Age"
            onChange={handleChange}>
            {data?.map((currency) => (
              <MenuItem value={currency.code}>
                <div className={styles.currency}>
                  <img src={currency.img} alt="currency" />
                  <p>
                    {currency.name} ({currency.code?.toUpperCase()})
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
