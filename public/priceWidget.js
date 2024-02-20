const api = 'https://min-api.cryptocompare.com/data/price?fsym=BTC&tsyms=USD';

let lastUpdated = 0;

function updatePrice() {
  const now = Date.now();

  if (now - lastUpdated > 60000) {
    fetch(api)
      .then((response) => response.json())
      .then((data) => {
        const widget = document.getElementById('btc-price-widget');
        if (widget) {
          widget.textContent = `1 BTC = $ ${data.USD}`;
          lastUpdated = Date.now();
        }
      })
      .catch((error) => {
        console.log('Error getting BTC price:', error);
      });
  }
}

function createPriceWidget() {
  const widget = document.createElement('div');
  widget.id = 'btc-price-widget';
  widget.style.position = 'fixed';
  widget.style.bottom = '20px';
  widget.style.right = '20px';
  widget.style.backgroundColor = 'white';
  widget.style.border = '1px solid black';
  widget.style.padding = '10px';
  widget.style.borderRadius = '5px';
  widget.style.display = 'none';
  widget.style.cursor = 'move';
  widget.style.zIndex = '1000';
  widget.style.color = 'black';
  widget.textContent = 'Loading BTC price...';

  document.body.appendChild(widget);
}

function toggleWidgetVisibility(visible) {
  const widget = document.getElementById('btc-price-widget');
  if (widget) {
    widget.style.display = visible ? 'block' : 'none';
    if (visible) {
      updatePrice();
    }
  }
  chrome.storage.sync.set({ widgetEnabled: visible });
}

chrome.storage.sync.get(['widgetEnabled'], function (result) {
  if (result.widgetEnabled) {
    toggleWidgetVisibility(true);
  } else {
    toggleWidgetVisibility(false);
  }
});

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.type === 'CHECK_READY') {
    sendResponse({ isReady: true });
  } else if (request.type === 'UPDATE_PRICE') {
    chrome.storage.sync.get(['widgetEnabled'], function (result) {
      if (result.widgetEnabled) {
        updatePrice();
      }
    });
  } else if (request.type === 'TOGGLE_WIDGET') {
    toggleWidgetVisibility(request.visible);
  }
});
createPriceWidget();
