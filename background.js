// chrome.tabs.onActivated.addListener(tab=>{
//     // prints current tab id and window id
//     // console.log(tab)

//     chrome.tabs.get(tab.tabId, current_tab_info=>{
//         // print window url
//         // console.log(current_tab_info.url)
//         if (/^https:\/\/www\.amazon/.test(current_tab_info.url)){
//             chrome.tabs.executeScript(null, {file:'foreground.js'}, ()=> console.log('I injected'))
//         }
//     });
// });
console.log("5")
var urlRegex = /^https?:\/\/(?:[^./?#]+\.)?amazon\.com/;
function doStuffWithDom(domContent) {
    console.log('I received the following DOM content:\n' + domContent);
    // console.log('in doStuffWithDom')
}
console.log("6")
// When the browser-action button is clicked...
chrome.browserAction.onClicked.addListener(function (tab) {
    // ...check the URL of the active tab against our pattern and...
    console.log("1")
    if (urlRegex.test(tab.url)) {
        // ...if it matches, send a message specifying a callback too
        console.log("2")
        chrome.tabs.sendMessage(tab.id, {text: 'report_back'}, doStuffWithDom);
    }
});