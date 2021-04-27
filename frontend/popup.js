console.log("Executing popup.js")

var getInitialData = info => {
    // console.log('Storing data in chrome storage')
    product = {}
    product_reviews = {}
    product = JSON.stringify(info)
    chrome.storage.local.set({ 'product_details': product }, function () {})
    chrome.storage.local.set({ 'product_review_details': product_reviews }, function () {})
    console.log('current tab updated with 1st reviews page')
    console.log('reviews page',info.productAllReviewsLink)
    chrome.tabs.update({ url: info.productAllReviewsLink })
}

var getReviewData = info => {

    console.log('are reviews fetched undefined here?:', typeof info)
    if (typeof info.baseURL !== "undefined") {
        console.log('this is the last page, we have reached the baseURL:', info.baseURL)
        new_reviews = info
        chrome.storage.local.get(['product_review_details'], function (result) {
            stored_reviews = result["product_review_details"]
            var i = 0
            stored_reviews_length = Object.keys(stored_reviews).length
            new_reviews_length = Object.keys(new_reviews).length
            while (i < new_reviews_length) {
                stored_reviews[stored_reviews_length++] = new_reviews[i++]
            }

            fetch('https://chrome-extension-backend.herokuapp.com/predict', {
                method: 'post',
                body: JSON.stringify(stored_reviews)
            }).then(function(response) {
                console.log('response',response)
                return response.json();
            }).then(function(data) {
                // console.log('Output:', data);
                console.log('positive_summary',data.positive_summary);
                document.querySelector('#postive-summary').textContent= data.positive_summary,
                document.querySelector('#negative-summary').textContent= data.negative_summary,
                document.querySelector('#keywords').textContent= data.keywords
            });
        });

        // chrome.storage.local.get(['product_details', 'product_review_details'], function (result) {
        //     var url = 'data:application/json;base64,' + btoa(result.product_details);
        //     chrome.downloads.download({
        //         url: url,
        //         filename: 'product_details.json'
        //     });
        //     var product_review_json = JSON.stringify(result.product_review_details)
        //     var url = 'data:application/json;base64,' + btoa(unescape(encodeURIComponent(product_review_json)));
        //     chrome.downloads.download({
        //         url: url,
        //         filename: 'product_reviews_details.json'
        //     });
        // });
        
        chrome.storage.local.remove(["product_details", "product_review_details"], function () {
            var error = chrome.runtime.lastError;
            if (error) {
                console.error(error);
            }
        });
        console.log('Lets update to the original baseURL')
        chrome.tabs.update({ url: info.baseURL }) 
    }
    else if (typeof info.nextReviewsURL){ 
       console.log('This is not the last reviews page')
        new_reviews = info
        chrome.storage.local.get(['product_review_details'], function (result) {
            stored_reviews = result["product_review_details"]
            var i = 0
            stored_reviews_length = Object.keys(stored_reviews).length
            new_reviews_length = Object.keys(new_reviews).length
            while (i < new_reviews_length) {
                stored_reviews[stored_reviews_length++] = new_reviews[i++]
            }
            chrome.storage.local.set({ 'product_review_details': stored_reviews }, function () {})
        })
        console.log('Navigating to the next reviews page')
        chrome.tabs.update({ url: info.nextReviewsURL })
    }
}
document.addEventListener("DOMContentLoaded", () => {
    console.log("Dom loaded and sending message to content.js")
    document.getElementById("start-your-magic").addEventListener('click', function () {
        chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
            var product_url=tabs[0].url
            // console.log('Product url:',product_url)
            chrome.storage.local.set({'product_url':product_url })
            chrome.tabs.sendMessage(tabs[0].id, { text: 'get-initial-data' }, getInitialData);

        })
    });
});

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
    if (tab.status == 'complete') {
        chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
            console.log('onUpdated event triggered')
            currentURL=tabs[0].url
            console.log('currentURL',currentURL) 
            chrome.storage.local.get(['product_url'], function(result){
                baseURL= result['product_url']
                // chrome.tabs.sendMessage(tabs[0].id, { text: 'get-review-data' }, getReviewData);
            if(baseURL!=currentURL){
                console.log('we have not reached baseURL yet, so onUpdated event triggered')
                chrome.tabs.sendMessage(tabs[0].id, { text: 'get-review-data' }, getReviewData);
            }
            else{
                console.log('not triggered')
            }
            })
            
        });
    }
});