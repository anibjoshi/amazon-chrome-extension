Amazon product reviews Analyzer

What problem are we trying to solve?
When you shop on Amazon, there are multiple choices for a simple product and the customer might not have any idea which one to choose. Also, the customer does not know the usbility of the product. Through this application, you can analyze the customer reviews and find insights in usability of the product.

How to use this tool?
First, clone the repository
git clone https://github.com/anuradhaboche/amazon-chrome-extension.git

1) Chrome Extension
- Go to chrome browser and type chrome:\\extensions. From top right corner of browser enable developers mode
- Click on 'Load unpacked' option and select thr frontend folder from the cloned github repo.
- Enable the chrome extension using toggle option


2) Modelling
- Open the repo in Visual Studio editor.
- type cd <download-folder>/amazon-chrome-extension in Terminal
- python3 -m venv venv
- source venv/bin/activate
- pip3 install -r requirements.txt

After creating the virtual environment, we are ready to use the app.

3) Demo
- Refresh the chrome extension using refresh symbol on chrome extension icon.
