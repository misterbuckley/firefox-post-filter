let tabData = {};

browser.runtime.onMessage.addListener((message, sender) => {
  if (message.type === 'incrementCount') {
    const tabId = sender.tab.id;
    if (!tabData[tabId]) {
      tabData[tabId] = { domain: message.domain, count: 0 };
    }
    tabData[tabId].count += message.amount || 0;
  } else if (message.type === 'getCount') {
    const tabId = message.tabId;
    return Promise.resolve(tabData[tabId] ? tabData[tabId].count : 0);
  }
});

browser.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.url) {
    const domain = new URL(changeInfo.url).hostname.replace(/^www\./, '');
    if (!tabData[tabId] || tabData[tabId].domain !== domain) {
      tabData[tabId] = { domain, count: 0 };
    }
  }
});

browser.tabs.onRemoved.addListener(tabId => {
  delete tabData[tabId];
});
