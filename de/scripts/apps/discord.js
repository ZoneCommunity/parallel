import { createWindow, focusWindow } from '../lib/windowManager.js';

function launchDiscord() {
    // Create the content area for the Discord window
    let contentArea = createWindow("Discord", '1060px', '750px');
    let win = contentArea.parentElement;
    let titleBar = win.querySelector('.titlebar');
    let closeButton = titleBar.querySelector('.titlebar-button');
    let closeIcon = closeButton.querySelector('img');

    // Customize the title bar
    closeIcon.src = './assets/window/close_white.svg';
    titleBar.style.backgroundColor = "#1E1F22";
    titleBar.style.color = "#1E1F22";

    // Create the webview element for Discord
    let webview = document.createElement('webview');
    webview.src = "https://discord.com/channels/@me";
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

export { launchDiscord };