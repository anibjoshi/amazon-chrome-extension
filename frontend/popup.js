var intervalId;
var reviewId;
function getSummaryData(review_id) {
    if (review_id != null) {
        body_input = JSON.stringify({ "id": review_id })
        fetch('https://ccht5748dc.execute-api.us-east-1.amazonaws.com/backend/results', {
            method: 'post',
            body: JSON.stringify({ "id": review_id })
        }).then(function (response) {
            return response.json();
        }).then(function (data) {
            output = JSON.parse(data.output);
            if (output !== null) {
                document.querySelector('#positive-summary').textContent = output.positive_summary
                document.querySelector('#negative-summary').textContent = output.negative_summary
                document.querySelector('#keywords').textContent = output.keywords
                positive_percentage = (output.number_of_positive_reviews / output.total_number_of_reviews) * 100
                document.querySelector('#percent-positive').textContent = positive_percentage.toFixed(0) + "%"
                negative_percentage = (output.number_of_negative_reviews / output.total_number_of_reviews) * 100
                document.querySelector('#percent-negative').textContent = negative_percentage.toFixed(0) + "%"
                window.clearInterval(intervalId);
            }
        });
    }
}

var getInitialData = info => {
    product = {}
    product_reviews = {}
    product = JSON.stringify(info)
    chrome.storage.local.set({ 'product_details': product }, function () { })
    chrome.storage.local.set({ 'product_review_details': product_reviews }, function () { })
    if (typeof info !== 'undefined') {
        chrome.tabs.update({ url: info.productAllReviewsLink })
    }
}

var getReviewData = info => {
    if (typeof info !== "undefined") {
        if (typeof info.baseURL !== "undefined") {
            new_reviews = info
            chrome.storage.local.get(['product_review_details'], function (result) {
                stored_reviews = result["product_review_details"]
                var i = 0
                if (typeof stored_reviews !== 'undefined') {
                    stored_reviews_length = Object.keys(stored_reviews).length
                    new_reviews_length = Object.keys(new_reviews).length
                    while (i < new_reviews_length) {
                        stored_reviews[stored_reviews_length++] = new_reviews[i++]
                    }
                    fetch('https://ccht5748dc.execute-api.us-east-1.amazonaws.com/backend/predict', {
                        method: 'post',
                        body: JSON.stringify(stored_reviews)
                    }).then(function (response) {
                        return response.json();
                    }).then(function (data) {
                        reviewId = data.id
                        intervalId = window.setInterval(function () { getSummaryData(reviewId) }, 5000);
                    });
                }
            });
            chrome.storage.local.remove(["product_details", "product_review_details"], function () {
                var error = chrome.runtime.lastError;
                if (error) {
                    console.error(error);
                }
            });
            chrome.tabs.update({ url: info.baseURL })
        }
        else if (typeof info.nextReviewsURL) {
            new_reviews = info
            chrome.storage.local.get(['product_review_details'], function (result) {
                stored_reviews = result["product_review_details"]
                var i = 0
                stored_reviews_length = Object.keys(stored_reviews).length
                new_reviews_length = Object.keys(new_reviews).length
                while (i < new_reviews_length) {
                    stored_reviews[stored_reviews_length++] = new_reviews[i++]
                }
                chrome.storage.local.set({ 'product_review_details': stored_reviews }, function () { })
            })
            chrome.tabs.update({ url: info.nextReviewsURL })
        }
    }
}
document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("start-your-magic").addEventListener('click', function () {
        chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
            var product_url = tabs[0].url
            chrome.storage.local.set({ 'product_url': product_url })
            chrome.tabs.sendMessage(tabs[0].id, { text: 'get-initial-data' }, getInitialData);

        })
    });
});

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
    if (tab.status == 'complete') {
        chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
            currentURL = tabs[0].url
            chrome.storage.local.get(['product_url'], function (result) {
                baseURL = result['product_url']
                // chrome.tabs.sendMessage(tabs[0].id, { text: 'get-review-data' }, getReviewData);
                if (baseURL != currentURL) {
                    chrome.tabs.sendMessage(tabs[0].id, { text: 'get-review-data' }, getReviewData);
                }
            })
        });
    }
});