import { createWindow, focusWindow } from '../lib/windowManager.js';

function launchInternet() {
    // Create the content area for the Internet window
    let contentArea = createWindow("Internet", '1060px', '750px');
    let win = contentArea.parentElement;

    let tabs = [];
    let activeTabId = 0;
    let nextTabId = 1;

    contentArea.style.padding = '0';
    contentArea.style.width = 'calc(100%)';
    contentArea.style.height = 'calc(100% - 50px)';

    let mainContainer = document.createElement('div');
    mainContainer.style.width = '100%';
    mainContainer.style.height = '100%';
    mainContainer.style.position = 'relative';

    let tabBar = document.createElement('div');
    tabBar.style.position = 'absolute';
    tabBar.style.top = '40px';
    tabBar.style.left = '0';
    tabBar.style.width = '100%';
    tabBar.style.height = '35px';
    tabBar.style.backgroundColor = 'rgba(255, 255, 255, 0.7)';
    tabBar.style.display = 'flex';
    tabBar.style.alignItems = 'center';
    tabBar.style.borderBottom = '1px solid rgba(210, 210, 210, 0.9)';
    tabBar.style.zIndex = '2';

    let tabScrollContainer = document.createElement('div');
    tabScrollContainer.style.display = 'flex';
    tabScrollContainer.style.alignItems = 'center';
    tabScrollContainer.style.overflowX = 'auto';
    tabScrollContainer.style.overflowY = 'visible';
    tabScrollContainer.style.paddingTop = '8px';
    tabScrollContainer.style.paddingBottom = '8px';
    tabScrollContainer.style.paddingLeft = '4px';
    tabScrollContainer.style.paddingRight = '9px';
    tabScrollContainer.style.scrollbarWidth = 'none';
    tabScrollContainer.style.msOverflowStyle = 'none';
    tabScrollContainer.style.cssText += `
        &::-webkit-scrollbar {
            display: none;
        }
    `;

    let navContainer = document.createElement('div');
    navContainer.style.position = 'absolute';
    navContainer.style.top = '0';
    navContainer.style.left = '0';
    navContainer.style.width = '100%';
    navContainer.style.height = '40px';
    navContainer.style.backgroundColor = 'rgba(255, 255, 255, 0.7)';
    navContainer.style.display = 'flex';
    navContainer.style.alignItems = 'center';

    let webviewContainer = document.createElement('div');
    webviewContainer.style.position = 'absolute';
    webviewContainer.style.top = '75px';
    webviewContainer.style.left = '0';
    webviewContainer.style.width = '100%';
    webviewContainer.style.height = 'calc(100% - 75px)';

    // Nav controls
    let backButton = document.createElement('button');
    backButton.textContent = '<-';
    backButton.style.marginLeft = '5px';
    backButton.style.paddingLeft = '6px';
    backButton.style.paddingRight = '6px';
    backButton.addEventListener('click', () => {
        let activeTab = getActiveTab();
        if (activeTab && activeTab.webview.canGoBack) {
            activeTab.webview.goBack();
        }
    });
    let forwardButton = document.createElement('button');
    forwardButton.textContent = '->';
    forwardButton.style.marginLeft = '3px';
    forwardButton.style.paddingLeft = '6px';
    forwardButton.style.paddingRight = '6px';
    forwardButton.addEventListener('click', () => {
        let activeTab = getActiveTab();
        if (activeTab && activeTab.webview.canGoForward) {
            activeTab.webview.goForward();
        }
    });
    let refreshButton = document.createElement('button');
    refreshButton.textContent = 'Ref';
    refreshButton.style.marginLeft = '5px';
    refreshButton.style.paddingLeft = '7px';
    refreshButton.style.paddingRight = '7px';
    refreshButton.addEventListener('click', () => {
        let activeTab = getActiveTab();
        if (activeTab) {
            activeTab.webview.reload();
        }
    });
    let urlInput = document.createElement('input');
    urlInput.type = 'text';
    urlInput.placeholder = 'Enter URL or search with Google...';
    urlInput.style.flex = '1';
    urlInput.style.marginLeft = '5px';
    urlInput.style.marginRight = '5px';
    urlInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            handleUrlInput();
        }
    });
    let goButton = document.createElement('button');
    goButton.textContent = 'Go';
    goButton.style.marginRight = '5px';
    goButton.addEventListener('click', handleUrlInput);
    let newTabButton = document.createElement('button');
    newTabButton.textContent = '+';
    newTabButton.style.marginLeft = '-6px';
    newTabButton.style.marginRight = '8px';
    newTabButton.style.padding = '3px';
    newTabButton.style.paddingLeft = '7px';
    newTabButton.style.paddingRight = '7px';
    newTabButton.style.borderRadius = '999px';
    newTabButton.style.fontSize = '16px';
    newTabButton.addEventListener('click', () => createNewTab());

    // tab management functions
    function createNewTab(url = "https://www.google.com") {
        let tabId = nextTabId++;
        
        let tabElement = document.createElement('div');
        tabElement.style.display = 'flex';
        tabElement.style.alignItems = 'center';
        tabElement.style.paddingLeft = '11px';
        tabElement.style.backgroundColor = '#ebebeb';
        tabElement.style.borderRadius = '3px';
        tabElement.style.marginRight = '3px';
        tabElement.style.minWidth = '150px';
        tabElement.style.maxWidth = '200px';
        tabElement.style.height = 'calc(35px * 0.78)';
        tabElement.style.flexShrink = '0';
        tabElement.style.borderColor = '#9f9f9f';
        tabElement.style.borderWidth = '0.5px';
        tabElement.style.borderStyle = 'solid';

        let tabTitle = document.createElement('span');
        tabTitle.textContent = 'New Tab';
        tabTitle.style.flex = '1';
        tabTitle.style.overflow = 'hidden';
        tabTitle.style.textOverflow = 'ellipsis';
        tabTitle.style.whiteSpace = 'nowrap';
        tabTitle.style.fontSize = '12px';

        let closeButton = document.createElement('button');
        closeButton.textContent = '×';
        closeButton.style.textAlign = 'right';
        closeButton.style.fontSize = '16px';
        closeButton.style.border = 'none';
        closeButton.style.backgroundColor = 'transparent';
        closeButton.style.boxShadow = 'none';
        closeButton.style.borderRadius = '999px';
        closeButton.style.outline = 'none';
        closeButton.addEventListener('click', (e) => {
            e.stopPropagation();
            closeTab(tabId);
        });

        tabElement.appendChild(tabTitle);
        tabElement.appendChild(closeButton);
        tabElement.addEventListener('click', () => switchToTab(tabId));

        // Create webview
        let webview = document.createElement('webview');
        webview.src = url;
        webview.style.width = "100%";
        webview.style.height = "100%";
        webview.style.display = 'none';
        webview.addEventListener("focus", () => {
            focusWindow(win);
        });

        // Update tab title when page loads
        webview.addEventListener('page-title-updated', (e) => {
            tabTitle.textContent = e.title || 'Untitled';
        });

        webview.addEventListener('did-navigate', () => {
            if (tabId === activeTabId) {
                updateUrlInput();
            }
        });

        let tab = {
            id: tabId,
            element: tabElement,
            webview: webview,
            title: tabTitle,
            url: url
        };

        tabs.push(tab);
        tabScrollContainer.appendChild(tabElement);
        webviewContainer.appendChild(webview);
        
        switchToTab(tabId);
        
        setTimeout(() => {
            tabScrollContainer.scrollLeft = tabScrollContainer.scrollWidth;
        }, 0);

        // At max size, adjust new tab button
        if (tabScrollContainer.scrollWidth > tabScrollContainer.clientWidth) {
            newTabButton.style.marginLeft = '4px';
        } else {
            newTabButton.style.marginLeft = '-6px';
        }
        
        urlInput.value = '';
        urlInput.focus();

        return tab;
    }

    function getActiveTab() {
        return tabs.find(tab => tab.id === activeTabId);
    }

    function switchToTab(tabId) {
        tabs.forEach(tab => {
            tab.webview.style.display = 'none';
            tab.element.style.backgroundColor = '#ebebeb';
        });
        let activeTab = tabs.find(tab => tab.id === tabId);
        if (activeTab) {
            activeTab.webview.style.display = '';
            activeTab.element.style.backgroundColor = '#ffffff';
            activeTabId = tabId;
            updateUrlInput();
        }
    }

    function closeTab(tabId) {
        let tabIndex = tabs.findIndex(tab => tab.id === tabId);
        if (tabIndex === -1) return;

        let tab = tabs[tabIndex];
        
        tab.element.remove();
        tab.webview.remove();
        
        tabs.splice(tabIndex, 1);

        if (tabId === activeTabId) {
            if (tabs.length > 0) {
                let newActiveIndex = Math.min(tabIndex, tabs.length - 1);
                switchToTab(tabs[newActiveIndex].id);
            } else {
                createNewTab();
            }
        }
    }

    function updateUrlInput() {
        let activeTab = getActiveTab();
        if (activeTab && !urlInput.matches(':focus')) {
            urlInput.value = activeTab.webview.src;
        }
    }

    function handleUrlInput() {
        let activeTab = getActiveTab();
        if (!activeTab) return;

        let url = urlInput.value.trim();
        if (url) {
            const isValidDomain = (str) => {
                const domainPattern = /^[a-zA-Z0-9-]+\.[a-zA-Z0-9.-]+$/;
                return domainPattern.test(str);
            };
            
            const getDomainFromUrl = (url) => {
                const matches = url.match(/^https?:\/\/([^\/]+)/);
                return matches ? matches[1] : null;
            };
            
            if (url.startsWith('http://') || url.startsWith('https://')) {
                const domain = getDomainFromUrl(url);
                if (domain && isValidDomain(domain)) {
                    activeTab.webview.src = url;
                } else {
                    url = 'https://www.google.com/search?q=' + encodeURIComponent(url);
                    activeTab.webview.src = url;
                }
            } else if (isValidDomain(url)) {
                url = 'https://' + url;
                activeTab.webview.src = url;
            } else {
                url = 'https://www.google.com/search?q=' + encodeURIComponent(url);
                activeTab.webview.src = url;
            }
        }
        urlInput.blur();
    }

    navContainer.appendChild(backButton);
    navContainer.appendChild(forwardButton);
    navContainer.appendChild(refreshButton);
    navContainer.appendChild(urlInput);
    navContainer.appendChild(goButton);

    tabBar.appendChild(tabScrollContainer);
    tabBar.appendChild(newTabButton);

    mainContainer.appendChild(tabBar);
    mainContainer.appendChild(navContainer);
    mainContainer.appendChild(webviewContainer);

    contentArea.appendChild(mainContainer);

    createNewTab();

    setInterval(updateUrlInput, 100);
}

export { launchInternet };