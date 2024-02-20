import React from 'react';
import { Table } from 'antd';
import { useDispatch, useSelector } from 'react-redux';

import { getCoinTickers, clearCoinTickers } from '../../redux/slices/getCoinTickers';
import { getExchanges, clearExchanges } from '../../redux/slices/getExchanges';

import logo from '../../../public/logo.png';
import './Table.css';

const renderExchanges = (exchanges) => (
  <a className="link">
    {exchanges?.img ? <img src={exchanges?.img} alt="Image" className={'img'} /> : ''}
    {exchanges?.name.replace(/(com)$/i, '.$1').replace(/^\w/, (c) => c.toUpperCase())}
  </a>
);

const fixedColumns = [
  {
    title: 'Top Exchanges',
    dataIndex: 'exchanges',
    render: renderExchanges,
    fixed: 'left',
    width: 220,
  },
  {
    title: 'Market Pair',
    dataIndex: 'marketPair',
  },
  {
    title: 'Current Price',
    dataIndex: 'price',
  },
  {
    title: 'Maximum Price (24 hours)',
    dataIndex: 'HIGH24HOUR',
  },
  {
    title: 'Minimum Price (24 hours)',
    dataIndex: 'LOW24HOUR',
  },
  {
    title: 'Opening Price (24 hours)',
    dataIndex: 'OPEN24HOUR',
  },
  {
    title: 'Price Change (24 hours)',
    dataIndex: 'CHANGE24HOUR',
    render: (text, record) => {
      let colorClass = '';
      let number = record.CHANGE24HOUR.replace(/[%$€₮]/g, '');
      if (+number >= 0 && number !== '-0') {
        colorClass = 'green';
      } else {
        colorClass = 'red';
      }

      return <span className={`trust-score ${colorClass}`}>{record.CHANGE24HOUR}</span>;
    },
  },
  {
    title: 'Percentage Changes (24 hours)',
    dataIndex: 'CHANGEPCT24HOUR',
    render: (text, record) => {
      let colorClass = '';
      let number = record.CHANGEPCT24HOUR.replace(/[%$€₮]/g, '');
      if (+number >= 0) {
        colorClass = 'green';
      } else {
        colorClass = 'red';
      }

      return <span className={`trust-score ${colorClass}`}>{record.CHANGEPCT24HOUR}</span>;
    },
  },
  {
    title: 'Trading Volume (24 hours)',
    dataIndex: 'VOLUME24HOUR',
  },
  {
    title: 'Last Update',
    dataIndex: 'LASTUPDATE',
    fixed: 'right',
    width: 180,
  },
];

const TableExchanges = () => {
  const { data: tickers } = useSelector((state) => state.getCoinTickers);
  const { data: exchanges } = useSelector((state) => state.getExchanges);
  const { currentCoin } = useSelector((state) => state.currentCoin);
  const { currentCurrency } = useSelector((state) => state.currentCurrency);

  const [apiData, setApiData] = React.useState([]);
  const dispatch = useDispatch();

  function formatVolume(volume) {
    if (volume < 1000) {
      return volume.toFixed(2);
    } else if (volume < 1_000_000) {
      return (volume / 1000).toFixed(2) + ' K';
    } else if (volume < 1_000_000_000) {
      return (volume / 1_000_000).toFixed(2) + ' M';
    } else {
      return (volume / 1_000_000_000).toFixed(2) + ' B';
    }
  }

  function timeSince(timestamp) {
    const now = new Date();
    const updatedAt = new Date(timestamp * 1000);
    const secondsPast = (now - updatedAt) / 1000;

    if (secondsPast < 60) {
      return 'Just now';
    } else if (secondsPast < 3600) {
      const minutes = parseInt(secondsPast / 60);
      return minutes + ' minute' + (minutes > 1 ? 's' : '') + ' ago';
    } else if (secondsPast < 86400) {
      const hours = parseInt(secondsPast / 3600);
      return hours + ' hour' + (hours > 1 ? 's' : '') + ' ago';
    } else {
      const day = updatedAt.getDate();
      const month = updatedAt
        .toDateString()
        .match(/ [a-zA-Z]*/)[0]
        .replace(' ', '');
      const year =
        updatedAt.getFullYear() === now.getFullYear() ? '' : ' ' + updatedAt.getFullYear();
      return day + ' ' + month + year;
    }
  }

  React.useEffect(() => {
    dispatch(clearCoinTickers());
    if (currentCoin && currentCurrency) {
      dispatch(getCoinTickers({ currentCoin, currentCurrency }));
    }
  }, [currentCoin, currentCurrency]);

  var wrapper = document.querySelector('.wrapper');

  chrome.system.display.getInfo(function (displays) {
    if (displays[0].workArea.height < 600) {
      wrapper.style.padding = `75px 17px 7px 11px`;
    }
  });

  const updateApiData = React.useCallback(() => {
    if (Array.isArray(tickers) && tickers.length > 0) {
      const updatedData = tickers?.map((marketData) => {
        const foundMarket =
          Array.isArray(exchanges) && exchanges.length > 0
            ? exchanges?.find(
                (exchangeData) =>
                  exchangeData.name.toUpperCase() === marketData.MARKET.toUpperCase(),
              )
            : null;
        if (foundMarket) {
          return {
            ...marketData,
            image: foundMarket.image,
          };
        }
        return marketData;
      });
      const fixed = [];
      updatedData?.map((up) => {
        fixed.push({
          id: up.MARKET,
          exchanges: { img: up.image, name: up.MARKET },
          marketPair: `${up.FROMSYMBOL}/${up.TOSYMBOL}`,
          price: `${
            currentCurrency === 'USD'
              ? '$'
              : currentCurrency === 'EUR'
              ? '€'
              : currentCurrency === 'USDT'
              ? '₮'
              : ''
          } ${up.PRICE?.toFixed(4)}`,
          HIGH24HOUR: `${
            currentCurrency === 'USD'
              ? '$'
              : currentCurrency === 'EUR'
              ? '€'
              : currentCurrency === 'USDT'
              ? '₮'
              : ''
          } ${up.HIGH24HOUR?.toFixed(4)}`,
          LOW24HOUR: `${
            currentCurrency === 'USD'
              ? '$'
              : currentCurrency === 'EUR'
              ? '€'
              : currentCurrency === 'USDT'
              ? '₮'
              : ''
          } ${up.LOW24HOUR?.toFixed(4)}`,
          OPEN24HOUR: `${
            currentCurrency === 'USD'
              ? '$'
              : currentCurrency === 'EUR'
              ? '€'
              : currentCurrency === 'USDT'
              ? '₮'
              : ''
          } ${up.OPEN24HOUR?.toFixed(4)}`,
          CHANGE24HOUR: `${
            currentCurrency === 'USD'
              ? '$'
              : currentCurrency === 'EUR'
              ? '€'
              : currentCurrency === 'USDT'
              ? '₮'
              : ''
          } ${up.CHANGE24HOUR?.toFixed(4) ?? 0.0}`,
          CHANGEPCT24HOUR: `${up.CHANGEPCT24HOUR?.toFixed(2) ?? 0.0} %`,
          VOLUME24HOUR: `${up.VOLUME24HOUR ? formatVolume(up.VOLUME24HOUR) : '0.00'}`,
          LASTUPDATE: `${up.LASTUPDATE ? timeSince(up.LASTUPDATE) : '-'}`,
        });
      });
      setApiData(fixed);
    } else {
      return [];
    }
  }, [tickers, exchanges]);

  React.useEffect(() => {
    updateApiData();
  }, [updateApiData]);

  React.useEffect(() => {
    dispatch(getExchanges());
    chrome.alarms.create({ delayInMinutes: 1 });

    const alarmListener = () => {
      chrome.notifications.create({
        type: 'basic',
        iconUrl: logo,
        title: 'Arbify',
        message: 'Data updated!',
        priority: 0,
      });
    };
    if (currentCoin && currentCurrency) {
      dispatch(getCoinTickers({ currentCoin, currentCurrency }));
      dispatch(getExchanges());
    }
    chrome.alarms.onAlarm.addListener(alarmListener);

    return () => {
      chrome.alarms.onAlarm.removeListener(alarmListener);
      dispatch(clearExchanges());
    };
  }, []);

  return (
    <>
      <Table
        columns={fixedColumns}
        dataSource={apiData}
        pagination={false}
        scroll={{
          x: 2000,
          y: 300,
        }}
      />
    </>
  );
};
export default TableExchanges;
