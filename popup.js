document.addEventListener('DOMContentLoaded', () => {
  browser.tabs.query({active: true, currentWindow: true}).then(tabs => {
    const tabId = tabs[0].id;
    browser.runtime.sendMessage({type: 'getCount', tabId}).then(count => {
      document.getElementById('count').textContent = count;
    });
  });
});
