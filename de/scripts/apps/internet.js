import { createWindow, focusWindow } from '../lib/windowManager.js';

function launchInternet() {
    // Create the content area for the Internet window
    let contentArea = createWindow("Internet", '1060px', '750px');
    let win = contentArea.parentElement;
    let titleBar = win.querySelector('.titlebar');
    let closeButton = titleBar.querySelector('.titlebar-button');
    let closeIcon = closeButton.querySelector('img');

    // Customize the title bar
    closeIcon.src = './assets/window/close_white.svg';
    titleBar.style.backgroundColor = "#000000";
    titleBar.style.color = "#000000";

    // Create the webview element for Internet
    let webview = document.createElement('webview');
    webview.src = "https://www.google.com";
    webview.style.width = "100%";
    webview.style.height = "calc(100% - 50px)";
    webview.style.position = "absolute";
    webview.style.top = "50px";
    webview.style.left = "0";

    // Handle focus event for the webview
    webview.addEventListener("focus", () => {
        focusWindow(win);
    });

    let navContainer = document.createElement('div');
    navContainer.style.position = 'absolute';
    navContainer.style.top = '0px';
    navContainer.style.left = '0';
    navContainer.style.width = '100%';
    navContainer.style.height = '50px';
    navContainer.style.backgroundColor = '#000000';
    navContainer.style.display = 'flex';
    navContainer.style.alignItems = 'center';
    navContainer.style.padding = '0 10px';

    let urlInput = document.createElement('input');
    urlInput.type = 'text';
    urlInput.placeholder = 'Enter URL...';
    urlInput.style.width = '80%';
    urlInput.style.height = '40px';
    urlInput.style.marginRight = '5px';
    urlInput.style.padding = '0px';
    urlInput.style.paddingLeft = '10px';
    urlInput.style.marginTop = '0px';
    urlInput.style.backgroundColor = '#1E1F22'
    urlInput.style.color = '#FFFFFF';
    //urlInput.style.border = '0.5px solid #9f9f9f;'
    urlInput.style.fontSize = '16px';
    
    let goButton = document.createElement('button');
    goButton.textContent = 'Go';
    goButton.style.height = '40px';
    goButton.style.padding = '0px';
    goButton.style.paddingLeft = '20px';
    goButton.style.paddingRight = '20px';
    goButton.style.fontSize = '16px';
    goButton.style.backgroundColor = '#1E1F22'
    goButton.style.color = '#FFFFFF';

    goButton.addEventListener('click', function() {
        let url = urlInput.value.trim();
        if (url) {
            if (!url.startsWith('http')) {
                url = 'https://' + url;
            } else if (!url.startsWith('https://')) {
                url = 'https://' + url;
            }
            webview.src = url;
        }
    });

    let isTyping = false;
    urlInput.addEventListener('focus', function() {
        isTyping = true;
    });
    
    urlInput.addEventListener('blur', function() {
        isTyping = false;
    });
    setInterval(function() {
        if (!isTyping) {
            urlInput.value = webview.src;
        }
    }, 1000);

    navContainer.appendChild(urlInput);
    navContainer.appendChild(goButton);

    // Append the webview to the content area
    contentArea.appendChild(webview);
    contentArea.appendChild(navContainer);
}

export { launchInternet };