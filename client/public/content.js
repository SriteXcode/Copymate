chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.action === "getSelectedText") {
    const selection = window.getSelection().toString();
    sendResponse({ text: selection });
  }
});