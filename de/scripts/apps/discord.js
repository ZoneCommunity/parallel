import { createWindow, focusWindow } from '../lib/windowManager.js';

function launchDiscord() {

    let Window2 = createWindow("Discord", '1060px', '750px');
    let WindowBase2 = Window2.parentElement;
    let TitleBar2 = WindowBase2.querySelector('.titlebar');
    let CloseButton = TitleBar2.querySelector('.titlebar-button');
    let Clsbtn = CloseButton.querySelector('img');
    Clsbtn.src = './assets/window/close_white.svg';
    TitleBar2.style.backgroundColor = "#1E1F22";
    TitleBar2.style.color = "#1E1F22";
    var iframe = document.createElement('webview');
    // Set iframe attributes
    iframe.src = "https://discord.com/channels/@me";
    iframe.style.width = "100%";
    iframe.style.height = "100%"
    iframe.style.position = "absolute";
    iframe.style.top = "0";
    iframe.style.left = "0";
    //iframe.preload = "./scripts/apps/test.js";
    iframe.addEventListener("focus", () => {
        focusWindow(WindowBase2);
    });
    
    // Append the iframe to the body
    Window2.appendChild(iframe);
}

export { launchDiscord };