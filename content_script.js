const SITES = {
  'reddit': {
    url: '*://www.reddit.com/*',
    selector: 'article',
  },
  'facebook': {
    url: '*://www.facebook.com/*',
    selector: 'div[data-pagelet^="FeedUnit_"]',
  },
  'instagram': {
    url: '*://www.instagram.com/*',
    selector: 'article div[role="button"] span',
  },
  'tiktok': {
    url: '*://www.tiktok.com/*',
    selector: 'div.tiktok-1p6exx2-DivItemContainer',
  },
  'twitter': {
    url: '*://twitter.com/*',
    selector: 'article[role="article"]',
  },
};

let currentSelector = ''; // Will hold the selector for the current site

// Determine the current selector based on the current URL
const currentUrl = window.location.href;
for (let siteKey in SITES) {
  const site = SITES[siteKey];
  const urlPattern = new RegExp(site.url.replace(/\*/g, '.*'));
  if (urlPattern.test(currentUrl)) {
    currentSelector = site.selector;
    break;
  }
}
console.log('currentSelector:', currentSelector);
console.log('currentUrl:', currentUrl);

// If no matching site is found, exit the script
if (!currentSelector) {
  console.log('No matching site found for filtering.');
} else {
  // List of words to filter
  let filterWords = [
    "trump",
    "vance",
    "kamala",
    "harris",
    "biden",
    // Add more words as needed
  ];

  // Function to check if a text contains any of the filter words
  function containsFilterWord(text) {
    return filterWords.some(word => text.toLowerCase().includes(word.toLowerCase()));
  }

  // Function to remove or hide elements containing filter words
  function filterContent() {
    let posts = document.querySelectorAll(currentSelector);
    console.log('WordFilter:', 'Found', posts.length, 'posts.');

    let filteredCount = 0;
    let filterCountByWord = {};
    filterWords.forEach(word => {
      filterCountByWord[word] = 0;
    });

    posts.forEach(post => {
      if (containsFilterWord(post.innerText)) {
        filteredCount += 1;

        // Increment filterCountByWord for each word found in the post
        filterWords.forEach(word => {
          if (post.innerText.toLowerCase().includes(word.toLowerCase())) {
            filterCountByWord[word] += 1;
          }
        });

        post.style.display = "none"; // Hide the post
      }
    });

    console.log('WordFilter:', 'Filtered', filteredCount, 'posts for containing words in the blacklist:');
    console.log('Filter counts by word:', filterCountByWord);
  }

  // Run the filter when the page loads
  window.addEventListener("load", filterContent);

  // Observe for new content (e.g., infinite scrolling)
  let observer = new MutationObserver(filterContent);
  observer.observe(document.body, { childList: true, subtree: true });
}

