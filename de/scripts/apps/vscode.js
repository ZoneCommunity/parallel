import { createWindow, focusWindow } from '../lib/windowManager.js';

function launchVSCode() {
    // Create the content area for the VS Code window
    let contentArea = createWindow("Visual Studio Code", '1060px', '750px');
    let win = contentArea.parentElement;
    let titleBar = win.querySelector('.titlebar');
    let closeButton = titleBar.querySelector('.titlebar-button');
    let closeIcon = closeButton.querySelector('img');

    // Customize the title bar
    closeIcon.src = './assets/window/close_white.svg';
    titleBar.style.backgroundColor = "#181818";
    titleBar.style.color = "#181818";

    // Create the webview element for VS Code
    let webview = document.createElement('webview');
    webview.src = "https://vscode.dev";
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

export { launchVSCode };