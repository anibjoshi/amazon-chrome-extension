console.log("Executing popup.js")

var getInitialData = info => {
    console.log('Storing data in chrome storage')
    product = {}
    product_reviews = {}
    product = JSON.stringify(info)
    chrome.storage.local.set({ 'product_details': product }, function () {
        console.log('Added product.json to chrome.storage!')
    })
    chrome.storage.local.set({ 'product_review_details': product_reviews }, function () {
        console.log('Added product_review.json to chrome.storage!')
    })
    chrome.tabs.update({ url: info.productAllReviewsLink })

}

var getReviewData = info => {
    if (typeof info.baseURL !== "undefined") {
        new_reviews = info
        chrome.storage.local.get(['product_review_details'], function (result) {
            stored_reviews = result["product_review_details"]
            var i = 0
            stored_reviews_length = Object.keys(stored_reviews).length
            new_reviews_length = Object.keys(new_reviews).length
            while (i < new_reviews_length) {
                stored_reviews[stored_reviews_length++] = new_reviews[i++]
            }
            chrome.storage.local.set({ 'product_review_details': stored_reviews }, function () {
                console.log('added reviews to chrome.storage')
            });
        });

        chrome.storage.local.get(['product_details', 'product_review_details'], function (result) {
            console.log('chrome.storage product details ', result.product_details)
            console.log('chrome.storage product reviews details', result.product_review_details)
            var url = 'data:application/json;base64,' + btoa(result.product_details);
            console.log('product details url',url)
            chrome.downloads.download({
                url: url,
                filename: 'product_details.json'
            });
            var product_review_json = JSON.stringify(result.product_review_details)
            console.log('product_review_json',product_review_json)
            var url = 'data:application/json;base64,' + btoa(product_review_json);
            console.log('product review details url',url)
            chrome.downloads.download({
                url: url,
                filename: 'product_reviews_details.json'
            });
        });
        chrome.storage.local.remove(["product_details", "product_review_details"], function () {
            var error = chrome.runtime.lastError;
            if (error) {
                console.error(error);
            }
        });
    }
    else {
        new_reviews = info
        chrome.storage.local.get(['product_review_details'], function (result) {
            stored_reviews = result["product_review_details"]
            var i = 0
            stored_reviews_length = Object.keys(stored_reviews).length
            new_reviews_length = Object.keys(new_reviews).length
            while (i < new_reviews_length) {
                stored_reviews[stored_reviews_length++] = new_reviews[i++]
            }
            chrome.storage.local.set({ 'product_review_details': stored_reviews }, function () {
                console.log('added reviews to chrome.storage')
            })
        })
        chrome.tabs.update({ url: info.nextReviewsURL })
    }
}
document.addEventListener("DOMContentLoaded", () => {
    console.log("Dom loaded and sending message to content.js")
    document.getElementById("start-your-magic").addEventListener('click', function () {
        chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
            chrome.tabs.sendMessage(tabs[0].id, { text: 'get-initial-data' }, getInitialData);
        })
    });
});
chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
    if (tab.status == 'complete') {
        chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
            console.log('bubu')
            chrome.tabs.sendMessage(tabs[0].id, { text: 'get-review-data' }, getReviewData);
        });
    }
});
