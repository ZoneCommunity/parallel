import { createWindow, focusWindow } from '../lib/windowManager.js';

function launchPlutoSubsystem() {
    // Create the content area for the Pluto Subsystem window
    let contentArea = createWindow("Pluto Subsystem", '1060px', '750px');
    let win = contentArea.parentElement;

    // Create the webview element for Pluto Subsystem
    let webview = document.createElement('webview');
    webview.src = "./scripts/apps/pluto/index.html";
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

export { launchPlutoSubsystem };