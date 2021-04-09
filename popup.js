console.log("Executing popup.js")

var getInitialData = info => {
    console.log('Storing data in chrome storage')
    product = {}
    product_reviews = {}
    product = JSON.stringify(info)
    console.log("product:", product)
    chrome.storage.local.set({ 'product_details': product }, function () {
        console.log('Added product.json to chrome.storage!')
    })
    chrome.storage.local.set({ 'product_review_details': product_reviews }, function () {
        console.log('Added product_review.json to chrome.storage!')
    })
    chrome.tabs.update({ url: info.productAllReviewsLink })

}

var getReviewData = info => {
    // console.log("info ", info)
    if (typeof info.baseURL !== "undefined") {
        chrome.storage.local.get(['product_details', 'product_review_details'], function (result) {
            console.log('chrome.storage product details ', result.product_details)
            console.log('chrome.storage product reviews details', result.product_review_details)
            //     var url = 'data:application/json;base64,' + btoa(result.product_details);
            //     chrome.downloads.download({
            //         url: url,
            //         filename: 'product_details.json'
            //     });
            //     var url = 'data:application/json;base64,' + btoa(result.product_reviews_details);
            //     chrome.downloads.download({
            //         url: url,
            //         filename: 'product_reviews_details.json'
            //     });
            // });
            chrome.storage.local.remove(["product_details","product_review_details"],function(){
                var error = chrome.runtime.lastError;
                   if (error) {
                       console.error(error);
                   }
               })
        });
    }
    else {
        console.log('1')
        all_product_reviews={}
        new_reviews = JSON.stringify(info)
        chrome.storage.local.get(['product_review_details'], function(result){
            stored_reviews= result["product_review_details"]
            console.log("stored_reviews",stored_reviews)
            all_product_reviews= stored_reviews+new_reviews
            console.log("all_product_reviews", all_product_reviews)
            chrome.storage.local.set({ 'product_review_details': all_product_reviews }, function () {
                console.log('added reviews to chrome.storage')
                })
        })
        // console.log('new_reviews', new_reviews)
        // chrome.storage.local.get(['product_review_details'], function (result) {
        //     product_reviews = result.product_review_details
        //     console.log("product_reviews", product_reviews)
        //     var new_json = Object.assign(JSON.parse(product_reviews), JSON.parse(new_reviews))
        //     console.log('new_json', new_json)

        // })
        console.log('2')
        chrome.tabs.update({ url: info.nextReviewsURL })
        console.log('3')
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
