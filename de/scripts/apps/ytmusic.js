import { createWindow, focusWindow } from '../lib/windowManager.js';

function launchYTMusic() {
    // Create the content area for YouTube Music window
    let contentArea = createWindow("YouTube Music", '400px', '700px');
    let win = contentArea.parentElement;
    let titleBar = win.querySelector('.titlebar');
    let closeButton = titleBar.querySelector('.titlebar-button');
    let closeIcon = closeButton.querySelector('img');

    // Customize the title bar
    closeIcon.src = './assets/window/close_white.svg';
    titleBar.style.backgroundColor = "black";

    // Create the webview element for YouTube Music
    let webview = document.createElement('webview');
    webview.src = "https://music.youtube.com/";
    webview.style.width = "100%";
    webview.style.height = "100%";
    webview.style.position = "absolute";
    webview.style.top = "0";
    webview.style.left = "0";

    // Handle focus event for the webview
    webview.addEventListener("focus", () => {
        focusWindow(win);
    });

    // Append the webview to the content area
    contentArea.appendChild(webview);
}

export { launchYTMusic };