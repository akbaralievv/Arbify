import { useEffect, useState } from 'react';

import './App.css';
import arrow from './assets/next.png';

import SelectCoins from './components/inputs/SelectCoins';
import SelectCurrency from './components/inputs/SelectCurrency';
import TableExchanges from './components/tableExchanges/TableExchanges';

function App() {
  const [widgetEnabled, setWidgetEnabled] = useState(false);

  useEffect(() => {
    const checkContentScript = (tabId) => {
      chrome.tabs.sendMessage(tabId, { type: 'CHECK_READY' }, function (response) {
        if (chrome.runtime.lastError) {
          console.log('Content script not ready or not present:', chrome.runtime.lastError.message);
          return;
        }
        if (!response) {
          console.error('No response from content script');
          return;
        }
        if (response.isReady) {
          chrome.tabs.sendMessage(tabId, { type: 'UPDATE_PRICE' });
        }
      });
    };

    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      if (tabs[0]?.url?.startsWith('http')) {
        checkContentScript(tabs[0].id);
      }
    });

    chrome.storage.sync.get(['widgetEnabled'], function (result) {
      setWidgetEnabled(result.widgetEnabled ?? false);
    });
  }, []);

  const handleChangeCheckbox = (e) => {
    const checked = e.target.checked;
    setWidgetEnabled(checked);
    chrome.storage.sync.set({ widgetEnabled: checked });

    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      if (tabs[0]?.url?.startsWith('http')) {
        chrome.tabs.sendMessage(tabs[0].id, { type: 'CHECK_READY' }, function (response) {
          if (chrome.runtime.lastError) {
            console.log(
              'Content script not ready or not present:',
              chrome.runtime.lastError.message,
            );
            return;
          }
          if (!response) {
            console.log('No response from content script');
            return;
          }
          if (response.isReady) {
            chrome.tabs.sendMessage(tabs[0].id, { type: 'TOGGLE_WIDGET', visible: checked });
          }
        });
      }
    });
  };

  return (
    <div className="wrapper">
      <div className="inner">
        <div className="selects">
          <SelectCoins />
          <img src={arrow} alt="arrow" />
          <SelectCurrency />
        </div>
        <TableExchanges />
        <div className="checkWidget">
          <div class="checkbox-wrapper">
            <input
              checked={widgetEnabled}
              type="checkbox"
              id="widget-toggle"
              onChange={handleChangeCheckbox}
            />
            <svg viewBox="0 0 35.6 35.6">
              <circle class="background" cx="17.8" cy="17.8" r="17.8"></circle>
              <circle class="stroke" cx="17.8" cy="17.8" r="14.37"></circle>
              <polyline class="check" points="11.78 18.12 15.55 22.23 25.17 12.87"></polyline>
            </svg>
          </div>
          <p>Display Bitcoin price widget on page</p>
        </div>
      </div>
    </div>
  );
}

export default App;
