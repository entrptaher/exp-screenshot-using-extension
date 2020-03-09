const captureActiveTab = url => {
  return new Promise((resolve, reject) => {
    chrome.tabs.query({}, function(tabs) {
      const tab = tabs.find(e => e.url === url);
      chrome.tabs.captureVisibleTab(tab.windowId, {}, function(dataUrl) {
        resolve(dataUrl);
      });
    });
  });
};