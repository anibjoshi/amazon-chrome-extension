console.log("popup.js is loaded")

// chrome.tabs.query({active: true, currentWindow: true}, ([tab]) => {
//     document.querySelector('.info').textContent = tab.title;
//   });

// chrome.tabs.executeScript({code: 'document.title'}, ([title]) => {
//     document.querySelector('.info').textContent = title;
//   });

chrome.tabs.executeScript(null, {file:'content.js'}, ()=> console.log('I injected'))