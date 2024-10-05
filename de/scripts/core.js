import { processManager } from './lib/processManager.js'
import { createWindow } from './lib/windowManager.js'

// Apps
import { LaunchDesktop } from './apps/desktop.js';

const pm = new processManager();

function init() {
    console.log("Booting parallel...");

    LaunchDesktop();

    /* let myWindow = createWindow("Test");

    myWindow.innerHTML = "Hello, world!";

    let myWindow2 = createWindow("Me");

    myWindow2.innerHTML = "dewddced, world!"; */


    launchWebApp();
    launchDiscord();
    launchTerminal();
}

function launchWebApp() {

    let Window2 = createWindow("YouTube Music", '480px', '700px');
    let WindowBase2 = Window2.parentElement;
    let TitleBar2 = WindowBase2.querySelector('.titlebar');
    let CloseButton = TitleBar2.querySelector('.titlebar-button');
    let Clsbtn = CloseButton.querySelector('img');
    Clsbtn.src = './assets/window/close_white.svg';
    TitleBar2.style.backgroundColor = "black";
    var iframe = document.createElement('webview');
    // Set iframe attributes
    iframe.src = "https://music.youtube.com/";
    iframe.style.width = "100%";
    iframe.style.height = "calc(100% - 50px)";
    iframe.style.position = "absolute";
    iframe.style.top = "50px";
    iframe.style.left = "0";
    
    // Append the iframe to the body
    Window2.appendChild(iframe);
}

function launchTerminal() {
    let Window2 = createWindow("parallel Terminal", '400px', '500px');
    let WindowBase2 = Window2.parentElement;
    let TitleBar2 = WindowBase2.querySelector('.titlebar');
    let CloseButton = TitleBar2.querySelector('.titlebar-button');

    // Create a terminal output area
    const terminalOutput = document.createElement('div');
    terminalOutput.style.height = '90%';
    terminalOutput.style.overflowY = 'auto';
    terminalOutput.style.backgroundColor = '#ffffff00';
    terminalOutput.style.color = 'white';
    terminalOutput.style.padding = '10px';
    terminalOutput.style.fontFamily = 'monospace';
    terminalOutput.style.whiteSpace = 'pre-wrap'; // Preserve whitespace for terminal format

    // Create an input area for commands
    const terminalInput = document.createElement('input');
    terminalInput.type = 'text';
    terminalInput.style.width = '100%';
    terminalInput.style.padding = '10px';
    terminalInput.style.backgroundColor = '#ffffff00';
    terminalInput.style.color = 'white';
    terminalInput.style.border = 'none';
    terminalInput.style.outline = 'none';
    terminalInput.placeholder = 'Enter command...';

    terminalInput.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            const command = terminalInput.value;
            terminalOutput.textContent += `> ${command}\n`;
            terminalInput.value = '';
            
            try {
                const result = eval(command);
                terminalOutput.textContent += `${result}\n`;
            } catch (error) {
                terminalOutput.textContent += `Error: ${error.message}\n`;
            }
            terminalOutput.scrollTop = terminalOutput.scrollHeight;
        }
    });

    Window2.appendChild(terminalOutput);
    Window2.appendChild(terminalInput);
}

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
    iframe.style.height = "calc(100% - 45px)";
    iframe.style.position = "absolute";
    iframe.style.top = "45px";
    iframe.style.left = "0";
    
    // Append the iframe to the body
    Window2.appendChild(iframe);
}

function launchInternet() {
    let Window2 = createWindow("Internet", '900px', '700px');
    let WindowBase2 = Window2.parentElement;
    let TitleBar2 = WindowBase2.querySelector('.titlebar')
    var iframe = document.createElement('webview');
    // Set iframe attributes
    iframe.src = "https://www.google.com";
    iframe.style.width = "100%";
    iframe.style.height = "calc(100% - 100px)";
    iframe.style.position = "absolute";
    iframe.style.top = "100px";
    iframe.style.left = "0";

    let navContainer = document.createElement('div');
    navContainer.style.position = 'absolute';
    navContainer.style.top = '50px';
    navContainer.style.left = '0';
    navContainer.style.width = '100%';
    navContainer.style.height = '50px';
    navContainer.style.backgroundColor = '#f1f1f1';
    navContainer.style.display = 'flex';
    navContainer.style.alignItems = 'center';
    navContainer.style.padding = '0 10px';

    let urlInput = document.createElement('input');
    urlInput.type = 'text';
    urlInput.placeholder = 'Enter URL...';
    urlInput.style.width = '80%';
    urlInput.style.height = '30px';
    urlInput.style.marginRight = '10px';
    
    let goButton = document.createElement('button');
    goButton.textContent = 'Go';
    goButton.style.height = '30px';
    goButton.style.cursor = 'pointer';


    goButton.addEventListener('click', function() {
        let url = urlInput.value.trim();
        if (url) {
            if (!url.startsWith('http')) {
                url = 'https://' + url;
            }
            iframe.src = url;
        }
    });
        
    navContainer.appendChild(urlInput);
    navContainer.appendChild(goButton);
    
    // Append the iframe to the body
    Window2.appendChild(iframe);
    Window2.appendChild(navContainer);

    let isTyping = false;
    urlInput.addEventListener('focus', function() {
        isTyping = true;
    });

    urlInput.addEventListener('blur', function() {
        isTyping = false;
    });
    setInterval(function() {
        if (!isTyping) {
            urlInput.value = iframe.src;
        }
    }, 1000);
}

init();

export { pm };