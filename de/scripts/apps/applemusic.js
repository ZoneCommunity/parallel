import { createWindow, focusWindow } from '../lib/windowManager.js';

function launchAppleMusic() {
    // Create the content area for Apple Music window
    let contentArea = createWindow("Apple Music", '400px', '700px');
    let win = contentArea.parentElement;
    let titleBar = win.querySelector('.titlebar');
    let closeButton = titleBar.querySelector('.titlebar-button');
    let closeIcon = closeButton.querySelector('img');

    // Customize the title bar
    closeIcon.src = './assets/window/close_white.svg';
    titleBar.style.backgroundColor = "black";

    // Create the webview element for YouTube Music
    let webview = document.createElement('webview');
    webview.src = "https://beta.music.apple.com/us/home";
    webview.style.width = "100%";
    webview.style.height = "100%";
    webview.style.position = "absolute";
    webview.style.top = "0";
    webview.style.left = "0";

    webview.useragent = "Mozilla/5.0 (iPhone; CPU iPhone OS 17_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/129.0.6668.69 Mobile/15E148 Safari/604.1";

    // Handle focus event for the webview
    webview.addEventListener("focus", () => {
        focusWindow(win);
    });

    // Append the webview to the content area
    contentArea.appendChild(webview);
}

export { launchAppleMusic };