console.log("Executing popup.js")

var getInitialData = info=>{
    document.querySelector('#product-title').textContent= info.productTitle,
    document.querySelector('#product-price').textContent= info.productPrice,
    document.querySelector('#product-reviews-link').textContent= info.productAllReviewsLink
    chrome.tabs.update({url : info.productAllReviewsLink})
}

var getReviewData=info=> {
    document.querySelector('#product-rating').textContent= info.overallProductRating,
    document.querySelector("#product-review1-title").textContent= info.review1Title,
    document.querySelector("#product-review1-date").textContent= info.review1Date,
    document.querySelector("#product-review1-text").textContent= info.review1Text,

    document.querySelector("#product-review2-title").textContent= info.review2Title,
    document.querySelector("#product-review2-date").textContent= info.review2Date,
    document.querySelector("#product-review2-text").textContent= info.review2Text
    // chrome.tabs.update({url : info.productNextReviewLink})
}
document.addEventListener("DOMContentLoaded", ()=>{
    console.log("Dom loaded and sending message to content.js")
    chrome.tabs.query({active: true, currentWindow: true}, tabs=>{
        chrome.tabs.sendMessage(tabs[0].id,  {text: 'get-initial-data'}, getInitialData)
    });
});
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    if(tab.status=='complete') {
        chrome.tabs.query({active: true, currentWindow: true}, tabs => {
            chrome.tabs.sendMessage(tabs[0].id,  {text: 'get-review-data'}, getReviewData);
        });
    }
});
