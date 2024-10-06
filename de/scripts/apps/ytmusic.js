import { createWindow } from '../lib/windowManager.js';

function launchYTMusic() {
    let Window2 = createWindow("YouTube Music", '400px', '700px');
    let WindowBase2 = Window2.parentElement;
    let TitleBar2 = WindowBase2.querySelector('.titlebar');
    let CloseButton = TitleBar2.querySelector('.titlebar-button');
    let Clsbtn = CloseButton.querySelector('img');
    Clsbtn.src = './assets/window/close_white.svg';
    TitleBar2.style.backgroundColor = "black";
    var iframe = document.createElement('webview');
    iframe.src = "https://music.youtube.com/";
    iframe.style.width = "100%";
    iframe.style.height = "calc(100% - 50px)";
    iframe.style.position = "absolute";
    iframe.style.top = "50px";
    iframe.style.left = "0";

    Window2.appendChild(iframe);
}

export { launchYTMusic };