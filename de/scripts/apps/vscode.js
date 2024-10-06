import { createWindow, focusWindow } from '../lib/windowManager.js';

function launchVSCode() {

    let Window2 = createWindow("Visual Studio Code", '1060px', '750px');
    let WindowBase2 = Window2.parentElement;
    let TitleBar2 = WindowBase2.querySelector('.titlebar');
    let CloseButton = TitleBar2.querySelector('.titlebar-button');
    let Clsbtn = CloseButton.querySelector('img');
    Clsbtn.src = './assets/window/close_white.svg';
    TitleBar2.style.backgroundColor = "#181818";
    TitleBar2.style.color = "#181818";
    var iframe = document.createElement('webview');
    // Set iframe attributes
    iframe.src = "https://vscode.dev";
    iframe.style.width = "100%";
    iframe.style.height = "100%"
    iframe.style.position = "absolute";
    iframe.style.top = "0";
    iframe.style.left = "0";
    iframe.addEventListener("focus", () => {
        focusWindow(WindowBase2);
    });
    
    // Append the iframe to the body
    Window2.appendChild(iframe);
}

export { launchVSCode };