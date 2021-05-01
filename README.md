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
