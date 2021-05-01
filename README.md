**Amazon TL;DR**


This is a chrome extension for amazon shoppers. It lets you understand the product usability by analyzing product reviews using NLP techniques. 

To use this, follow below steps -
- First, clone the repository using git clone https://github.com/anuradhaboche/amazon-chrome-extension.git
- Go to chrome browser and type chrome://extensions. From top right corner of browser enable Developers mode
- Click on 'Load unpacked' option and select the frontend folder from the cloned github repo.
- Enable the chrome extension using toggle option

<img width="510" alt="image" src="https://user-images.githubusercontent.com/37079376/116767346-9960a580-a9fd-11eb-9258-00c2391ab810.png">

- To enable models, open the repository in Visual Studio editor.
- type cd <download-folder>/amazon-chrome-extension in terminal
- Execute below commands
  - python3 -m venv venv
  - source venv/bin/activate
  - pip3 install -r requirements.txt

After creating the virtual environment, we are ready to use the app.


**Demo**

- Refresh the chrome extension using refresh symbol on chrome extension icon.

<img width="503" alt="image" src="https://user-images.githubusercontent.com/37079376/116767440-1ee45580-a9fe-11eb-9538-74f5db9426a5.png">

- Navigate to the product you are thinking to purchase. Few examples to try
  -   https://www.amazon.com/Classic-Home-Garden-Patio-Honeysuckle/dp/B06XHX6JV8/ref=cm_cr_arp_d_product_top?ie=UTF8
  -   https://www.amazon.com/Mkono-Planters-Decorative-Gardening-Drainage/dp/B07M765LKF/ref=cm_cr_arp_d_product_top?ie=UTF8
 
 
 The app will provide output in below format 
 
 <img width="297" alt="image" src="https://user-images.githubusercontent.com/37079376/116767501-7387d080-a9fe-11eb-9c1a-68b96636f4ba.png">

Note: This is a work in progress. 
