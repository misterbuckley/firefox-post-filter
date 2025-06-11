const DOMAIN_SELECTORS = {
  'reddit.com': 'article',
  'twitter.com': 'article[role="article"]',
  'facebook.com': 'div[data-pagelet^="FeedUnit_"]',
  'instagram.com': 'article div[role="button"] span',
  'tiktok.com': 'div.tiktok-1p6exx2-DivItemContainer',
};

const domain = window.location.hostname.replace(/^www\./, '');
const currentSelector = DOMAIN_SELECTORS[domain];

if (!currentSelector) {
  console.log('No matching site found for filtering on domain:', domain);
} else {
  let filterWords = [];

  function loadFilterWords() {
    browser.storage.local.get(domain).then(result => {
      filterWords = result[domain] || [];
      filterContent();
    });
  }

  function containsFilterWord(text) {
    return filterWords.some(word => text.toLowerCase().includes(word.toLowerCase()));
  }

  function filterContent() {
    const posts = document.querySelectorAll(currentSelector);
    let filteredCount = 0;
    posts.forEach(post => {
      if (post.dataset.postFiltered) {
        return;
      }
      if (containsFilterWord(post.innerText)) {
        filteredCount += 1;
        post.style.display = 'none';
        post.dataset.postFiltered = 'true';
      }
    });
    if (filteredCount) {
      browser.runtime.sendMessage({
        type: 'incrementCount',
        domain: domain,
        amount: filteredCount
      });
      console.log('WordFilter:', 'Filtered', filteredCount, 'posts on', domain);
    }
  }

  loadFilterWords();

  browser.storage.onChanged.addListener((changes, area) => {
    if (area === 'local' && changes[domain]) {
      filterWords = changes[domain].newValue || [];
      filterContent();
    }
  });

  window.addEventListener('load', filterContent);
  const observer = new MutationObserver(filterContent);
  observer.observe(document.body, { childList: true, subtree: true });
}

