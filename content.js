console.log("Executing content.js")

chrome.runtime.onMessage.addListener((msg, sender, sendResponse)=>{
    console.log('current message', msg.text)
    if (msg.text=='get-initial-data'){
        var domInfo={
            productTitle: document.getElementById('productTitle').innerText,
            productPrice: document.getElementById('priceblock_ourprice').innerText,
            productAllReviewsLink: document.getElementsByClassName('a-link-emphasis a-text-bold')[0].href,
            overallProductRating: document.querySelectorAll("[data-hook='average-star-rating']")[0].innerText
        }
    } else if (msg.text=='get-review-data') {
        console.log('setting domInfo')
        console.log('current dom', document)
        console.log('review1Text:',document.getElementsByClassName("a-size-base review-text review-text-content")[0])
        console.log('review1Title:',document.getElementsByClassName("a-size-base a-link-normal review-title a-color-base review-title-content a-text-bold")[0])
        var domInfo={
            review1Title:document.getElementsByClassName("a-size-base a-link-normal review-title a-color-base review-title-content a-text-bold")[0].innerText,
            review1Title:document.getElementsByClassName("a-size-base a-link-normal review-title a-color-base review-title-content a-text-bold")[0].innerText,
            review1Date: document.querySelectorAll("[data-hook='review-date']")[0].innerText,
            review1Rating: document.querySelectorAll("[data-hook='review-star-rating']")[0].innerText,
            review1Text: document.getElementsByClassName("a-size-base review-text review-text-content")[0].innerText,

            review2Title:document.getElementsByClassName("a-size-base a-link-normal review-title a-color-base review-title-content a-text-bold")[1].innerText,
            review2Date: document.querySelectorAll("[data-hook='review-date']")[1].innerText,
            review2Rating: document.querySelectorAll("[data-hook='review-star-rating']")[1].innerText,
            review2Text: document.getElementsByClassName("a-size-base review-text review-text-content")[1].innerText,

            review3Title:document.getElementsByClassName("a-size-base a-link-normal review-title a-color-base review-title-content a-text-bold")[2].innerText,
            review3Date: document.querySelectorAll("[data-hook='review-date']")[2].innerText,
            review3Rating: document.querySelectorAll("[data-hook='review-star-rating']")[2].innerText,
            review3Text: document.getElementsByClassName("a-size-base review-text review-text-content")[2].innerText,
            
            review4Title:document.getElementsByClassName("a-size-base a-link-normal review-title a-color-base review-title-content a-text-bold")[3].innerText,
            review4Date: document.querySelectorAll("[data-hook='review-date']")[3].innerText,
            review4Rating: document.querySelectorAll("[data-hook='review-star-rating']")[3].innerText,
            review4Text: document.getElementsByClassName("a-size-base review-text review-text-content")[3].innerText,

            review5Title:document.getElementsByClassName("a-size-base a-link-normal review-title a-color-base review-title-content a-text-bold")[4].innerText,
            review5Date: document.querySelectorAll("[data-hook='review-date']")[4].innerText,
            review5Rating: document.querySelectorAll("[data-hook='review-star-rating']")[4].innerText,
            review5Text: document.getElementsByClassName("a-size-base review-text review-text-content")[4].innerText,

            review6Title:document.getElementsByClassName("a-size-base a-link-normal review-title a-color-base review-title-content a-text-bold")[5].innerText,
            review6Date: document.querySelectorAll("[data-hook='review-date']")[5].innerText,
            review6Rating: document.querySelectorAll("[data-hook='review-star-rating']")[5].innerText,
            review6Text: document.getElementsByClassName("a-size-base review-text review-text-content")[5].innerText,

            review7Title:document.getElementsByClassName("a-size-base a-link-normal review-title a-color-base review-title-content a-text-bold")[6].innerText,
            review7Date: document.querySelectorAll("[data-hook='review-date']")[6].innerText,
            review7Rating: document.querySelectorAll("[data-hook='review-star-rating']")[6].innerText,
            review7Text: document.getElementsByClassName("a-size-base review-text review-text-content")[6].innerText,

            review8Title:document.getElementsByClassName("a-size-base a-link-normal review-title a-color-base review-title-content a-text-bold")[7].innerText,
            review8Date: document.querySelectorAll("[data-hook='review-date']")[7].innerText,
            review8Rating: document.querySelectorAll("[data-hook='review-star-rating']")[7].innerText,
            review8Text: document.getElementsByClassName("a-size-base review-text review-text-content")[7].innerText,

            review9Title:document.getElementsByClassName("a-size-base a-link-normal review-title a-color-base review-title-content a-text-bold")[8].innerText,
            review9Date: document.querySelectorAll("[data-hook='review-date']")[8].innerText,
            review9Rating: document.querySelectorAll("[data-hook='review-star-rating']")[8].innerText,
            review9Text: document.getElementsByClassName("a-size-base review-text review-text-content")[8].innerText,

            review10Title:document.getElementsByClassName("a-size-base a-link-normal review-title a-color-base review-title-content a-text-bold")[9].innerText,
            review10Date: document.querySelectorAll("[data-hook='review-date']")[9].innerText,
            review10Rating: document.querySelectorAll("[data-hook='review-star-rating']")[9].innerText,
            review10Text: document.getElementsByClassName("a-size-base review-text review-text-content")[9].innerText,

            nextReviewsURL: document.getElementsByClassName("a-last")[0].getElementsByTagName('a')[0].href
            } 
        }
        console.log("sending domInfo!",domInfo)
        sendResponse(domInfo)
        return True
});
