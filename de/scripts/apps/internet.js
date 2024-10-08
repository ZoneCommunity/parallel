import { createWindow, focusWindow } from '../lib/windowManager.js';

function launchInternet() {
    // Create the content area for the Internet window
    let contentArea = createWindow("Internet", '1060px', '750px');
    let win = contentArea.parentElement;

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
    navContainer.style.backgroundColor = '#00000000';
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
    urlInput.style.fontSize = '16px';
    urlInput.style.borderWidth = '0.5px';

    urlInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            handleUrlInput();
        }
    });
    
    let goButton = document.createElement('button');
    goButton.textContent = 'Go';
    goButton.style.height = '40px';
    goButton.style.padding = '0px';
    goButton.style.paddingLeft = '20px';
    goButton.style.paddingRight = '20px';
    goButton.style.fontSize = '16px';

    goButton.addEventListener('click', function() {
        handleUrlInput();
    });

    function handleUrlInput() {
        let url = urlInput.value.trim();
        if (url) {
            const isValidDomain = (str) => {
                const domainPattern = /^[a-zA-Z0-9-]+\.[a-zA-Z]{2,}$/;
                return domainPattern.test(str);
            };
            if (isValidDomain(url)) {
                if (!url.startsWith('http://') && !url.startsWith('https://')) {
                    url = 'https://' + url;
                }
            } else {
                url = 'https://www.google.com/search?q=' + encodeURIComponent(url);
            }            
            webview.src = url;
        }

        urlInput.value = webview.src;
        urlInput.blur();
    }

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