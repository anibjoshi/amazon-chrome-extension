console.log("Executing content.js")

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    console.log('current message', msg.text)
    if (msg.text == 'get-initial-data') {
        console.log('setting initial data')
        // console.log('price',document.getElementById('priceblock_ourprice').innerText)
        var domInfo = {
            productTitle: document.getElementById('productTitle').innerText,
            // productPrice: document.getElementById('priceblock_ourprice').innerText,
            productAllReviewsLink: document.getElementsByClassName('a-link-emphasis a-text-bold')[0].href,
            overallProductRating: document.querySelectorAll("[data-hook='average-star-rating']")[0].innerText
        }
    } else if (msg.text == 'get-review-data') {
        console.log('setting domInfo');
        reviews = {}
        var i = 0;
        var length = document.getElementsByClassName("a-size-base a-link-normal review-title a-color-base review-title-content a-text-bold").length
        for (i = 0; i < length; i++) {
            reviewTitle = document.getElementsByClassName("a-size-base a-link-normal review-title a-color-base review-title-content a-text-bold")[i].innerText
            reviewDate = document.querySelectorAll("[data-hook='review-date']")[i].innerText
            reviewRating = document.querySelectorAll("[data-hook='review-star-rating']")[i].innerText
            reviewText = document.getElementsByClassName("a-size-base review-text review-text-content")[i].innerText
            // new_review = {
            //     'reviewTitle': reviewTitle,
            //     'reviewDate': reviewDate,
            //     'reviewRating': reviewRating,
            //     'reviewText': reviewText
            // }
            new_review={}
            new_review['reviewTitle'+i]=reviewTitle
            new_review['reviewDate'+i]=reviewDate
            new_review['reviewRating'+i]=reviewRating
            new_review['reviewText'+i]=reviewText
            reviews = Object.assign( reviews, new_review)
        }
        var next_url = document.getElementsByClassName("a-last")[0].getElementsByTagName('a')[0]
        console.log('next_url',next_url)
        if (typeof next_url !== 'undefined') {
            next_url_dict = {
                'nextReviewsURL': document.getElementsByClassName("a-last")[0].getElementsByTagName('a')[0].href
            }
        } else {
            // next_url_dict = Add the main product link here
            next_url_dict={
                'baseURL':'https://www.amazon.com/MUDEELA-Planter-Watering-Drainage-Shortage/dp/B088FTL4F1/ref=cm_cr_arp_d_product_top?ie=UTF8'
            }
        }
        domInfo = Object.assign( reviews, next_url_dict)
    }
    console.log("sending domInfo!", domInfo)
    sendResponse(domInfo)
    return True
});
