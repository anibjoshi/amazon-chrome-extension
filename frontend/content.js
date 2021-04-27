console.log("Executing content.js")
chrome.storage.local.get(['product_url'], function(result){
    baseURL= result['product_url']
    // console.log('baseURL from chrome.storage', baseURL) 
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    // console.log('current message', msg.text)
    if (msg.text == 'get-initial-data') {
        console.log('get-initial-data triggered')
        // console.log('price',document.getElementById('priceblock_ourprice').innerText)
        var domInfo = {
            productTitle: document.getElementById('productTitle').innerText,
            // productPrice: document.getElementById('priceblock_ourprice').innerText,
            productAllReviewsLink: document.getElementsByClassName('a-link-emphasis a-text-bold')[0].href,
            overallProductRating: document.querySelectorAll("[data-hook='average-star-rating']")[0].innerText
        }
    } else if (msg.text == 'get-review-data') {
        console.log('get-review-data triggered')
        reviews = {}
        var i = 0;
        var length = document.getElementsByClassName("a-size-base a-link-normal review-title a-color-base review-title-content a-text-bold").length
        for (i = 0; i < length; i++) {
            reviewTitle = document.getElementsByClassName("a-size-base a-link-normal review-title a-color-base review-title-content a-text-bold")[i].innerText
            reviewDate = document.querySelectorAll("[data-hook='review-date']")[i].innerText
            reviewRating = document.querySelectorAll("[data-hook='review-star-rating']")[i].innerText
            reviewText = document.getElementsByClassName("a-size-base review-text review-text-content")[i].innerText
            new_review_block = {
                'reviewTitle':reviewTitle,
                'reviewDate':reviewDate,
                'reviewRating':reviewRating,
                'reviewText':reviewText
            }
            reviews[i] = new_review_block
        }
        var next_url = document.getElementsByClassName("a-last")[0].getElementsByTagName('a')[0]

        if (typeof next_url !== 'undefined') {
            next_url_dict = {
                'nextReviewsURL': document.getElementsByClassName("a-last")[0].getElementsByTagName('a')[0].href
            }
        } else {
            next_url_dict={
                'baseURL':baseURL
            }
        }
   
        domInfo = Object.assign(reviews, next_url_dict)
    }
    console.log('sendResponse() triggered', domInfo)
    sendResponse(domInfo)
    return True
})
});
