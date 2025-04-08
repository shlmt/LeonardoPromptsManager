document.addEventListener("DOMContentLoaded", () => {
  const button = document.getElementById("btn");
  button.addEventListener("click", () => {
    chrome.tabs.create({ url: chrome.runtime.getURL("prompts.html") });
  });
});

chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
  chrome.tabs.sendMessage(tabs[0].id, { action: "activate_content_script" });
});
