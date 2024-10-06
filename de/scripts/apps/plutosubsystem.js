import { createWindow, focusWindow } from '../lib/windowManager.js';

function launchPlutoSubsystem() {

    let Window2 = createWindow("Pluto Subsystem", '1060px', '750px');
    let WindowBase2 = Window2.parentElement;
    let TitleBar2 = WindowBase2.querySelector('.titlebar');
    //let CloseButton = TitleBar2.querySelector('.titlebar-button');
    //let Clsbtn = CloseButton.querySelector('img');
    //Clsbtn.src = './assets/window/close_white.svg';
    //TitleBar2.style.backgroundColor = "#000000";
    //TitleBar2.style.color = "#FFFFFF";
    var iframe = document.createElement('webview');
    // Set iframe attributes
    iframe.src = "./scripts/apps/pluto/index.html";
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

export { launchPlutoSubsystem };