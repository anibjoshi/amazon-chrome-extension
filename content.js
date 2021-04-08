console.log("Executing content.js")
function getReviews(productDetails){

    //console.log(productDetails)
}
chrome.runtime.onMessage.addListener((msg, sender, sendResponse)=>{
    if (msg.text=='get-initial-data'){
        var domInfo={
            productTitle: document.getElementById('productTitle').innerText,
            productPrice: document.getElementById('priceblock_ourprice').innerText,
            productAllReviewsLink: document.getElementsByClassName('a-link-emphasis a-text-bold')[0].href
        }
    } else if (msg.text=='get-review-data') {
        productDetails= document.getElementsByClassName("a-section celwidget")
        getReviews(productDetails)
        var domInfo={
            overallProductRating: document.getElementsByClassName("a-size-medium a-color-base")[0].innerText,

            review1Title:document.getElementsByClassName("a-size-base a-link-normal review-title a-color-base review-title-content a-text-bold")[0].innerText,
            review1Date: document.querySelectorAll("[data-hook='review-date']")[0].innerText,
            review1Rating: document.querySelectorAll("[data-hook='review-star-rating']")[0].innerText,
            review1Text: document.getElementsByClassName("a-size-base review-text review-text-content")[0].innerText,

            review2Title:document.getElementsByClassName("a-size-base a-link-normal review-title a-color-base review-title-content a-text-bold")[1].innerText,
            review2Date: document.querySelectorAll("[data-hook='review-date']")[1].innerText,
            //review2Rating: document.querySelectorAll("[data-hook='review-star-rating]")[3],
            review2Text: document.getElementsByClassName("a-size-base review-text review-text-content")[1].innerText,

            review3Title:document.getElementsByClassName("a-size-base a-link-normal review-title a-color-base review-title-content a-text-bold")[2].innerText,
            review3Date: document.querySelectorAll("[data-hook='review-date']")[2].innerText,
            //review3Rating: document.querySelectorAll("[data-hook='review-star-rating]")[4],
            review3Text: document.getElementsByClassName("a-size-base review-text review-text-content")[2].innerText,
            
            } 
        }
        console.log("sending domInfo",domInfo)
        sendResponse(domInfo)
});
