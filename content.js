// console.log('from content.js') 
// console.log('the current url is\t' + window.location.href)
// console.log('Hello world')
console.log("4")

function processDOM(domContent) {
    console.log("in processDOM function")
    console.log('Product title:'+domContent.title)
    return document.title
}

// Listen for messages
chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
    // If the received message has the expected format...
    console.log("3")
    if (msg.text === 'report_back') {
        // Call the specified callback, passing
        // the web-page's DOM content as argument
        console.log("content.js in msg loop")
        sendResponse(document.outerHTML);
        console.log('content js has DOM element',document.title)
        // processDOM(document)
        
    }
    
});



