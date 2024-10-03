// core.js
import { VFS, Directory, File } from './vfs.js';
let System = {
    AppID: 0,
    zIndex: 1,
    vfs: new VFS()
};
export { System };
import { LaunchDesktop } from './apps/desktop.js';
import { createWindow, bringToFront } from './window.js';
import { launchMediaPlayer } from './apps/mediaplayer.js';

function Init() {
    LaunchDesktop();

    //launchInternet();

    //createFileBrowser();
    //launchMediaPlayer();

    launchWebApp();
    launchDiscord();

    //Window.appendChild(win);


    //System.vfs.changeDirectory('docs');
    //System.vfs.changeDirectory('life');
    console.log(System.vfs.listContents());
    //System.vfs.changeDirectory('..');
    //console.log(System.vfs.listContents());
    //console.log(System.vfs.readFile('wow.md'));
}

function launchWebApp() {

    createWindow("YouTube Music", null, '1100px', '700px');
    let WindowBase2 = document.getElementById(System.AppID);
    let Window2 = WindowBase2.querySelector('.window-content');
    let TitleBar2 = WindowBase2.querySelector('.titlebar');
    let CloseButton = TitleBar2.querySelector('.titlebar-button');
    let Clsbtn = CloseButton.querySelector('img');
    Clsbtn.src = './Group 2 copy.svg';
    TitleBar2.style.backgroundColor = "black";
    var iframe = document.createElement('webview');
    // Set iframe attributes
    iframe.src = "https://music.youtube.com/";
    iframe.style.width = "100%";
    iframe.style.height = "calc(100% - 50px)";
    iframe.style.position = "absolute";
    iframe.style.top = "50px";
    iframe.style.left = "0";

    TitleBar2.addEventListener('mousedown', function() {
        iframe.style.pointerEvents = 'none';
    });
    document.addEventListener('mouseup', function() {
        iframe.style.pointerEvents = 'auto';
    });
    
    // Append the iframe to the body
    Window2.appendChild(iframe);
}

function launchDiscord() {

    createWindow("Discord", null, '1100px', '700px');
    let WindowBase2 = document.getElementById(System.AppID);
    let Window2 = WindowBase2.querySelector('.window-content');
    let TitleBar2 = WindowBase2.querySelector('.titlebar');
    let CloseButton = TitleBar2.querySelector('.titlebar-button');
    let Clsbtn = CloseButton.querySelector('img');
    Clsbtn.src = './Group 2 copy.svg';
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

    TitleBar2.addEventListener('mousedown', function() {
        iframe.style.pointerEvents = 'none';
    });
    document.addEventListener('mouseup', function() {
        iframe.style.pointerEvents = 'auto';
    });
    
    // Append the iframe to the body
    Window2.appendChild(iframe);
}

function launchInternet() {
    createWindow("Internet", "./Internet.png", '900px', '700px');
    let WindowBase2 = document.getElementById(System.AppID);
    let Window2 = WindowBase2.querySelector('.window-content');
    let TitleBar2 = WindowBase2.querySelector('.titlebar')
    var iframe = document.createElement('webview');
    // Set iframe attributes
    iframe.src = "https://www.google.com";
    iframe.style.width = "100%";
    iframe.style.height = "calc(100% - 100px)";
    iframe.style.position = "absolute";
    iframe.style.top = "100px";
    iframe.style.left = "0";

    TitleBar2.addEventListener('mousedown', function() {
        iframe.style.pointerEvents = 'none';
    });
    document.addEventListener('mouseup', function() {
        iframe.style.pointerEvents = 'auto';
    });

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

function createFileBrowser() {
    createWindow("Files");
    const windowBase = document.getElementById(System.AppID);
    const window = windowBase.querySelector('.window-content');
    
    function renderContents(directory) {
        window.innerHTML = '';
        
        // Display current directory path
        const pathElement = document.createElement('div');
        pathElement.textContent = `Current Path: ${getFullPath(System.vfs.currentDirectory)}`;
        pathElement.style.fontWeight = 'bold';
        pathElement.style.marginBottom = '10px';
        pathElement.style.wordBreak = 'break-all';
        window.appendChild(pathElement);
        
        // Add a back button if not in root
        if (System.vfs.currentDirectory.name !== '/') {
            const backButton = document.createElement('button');
            backButton.textContent = '< Back';
            backButton.onclick = () => {
                System.vfs.changeDirectory('..');
                renderContents(System.vfs.currentDirectory);
            };
            window.appendChild(backButton);
        }
        
        const contents = System.vfs.listContents();
        contents.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.textContent = item;
            itemElement.style.cursor = 'pointer';
            itemElement.style.padding = '5px';
            itemElement.onclick = () => {
                const selectedItem = System.vfs.currentDirectory.getItem(item);
                if (selectedItem instanceof Directory) {
                    System.vfs.changeDirectory(item);
                    renderContents(selectedItem);
                } else if (selectedItem instanceof File) {
                    createFileEditor(selectedItem);
                }
            };
            window.appendChild(itemElement);
        });
    }
    
    function getFullPath(directory) {
        const path = [];
        let currentDir = directory;
        while (currentDir && currentDir.name !== '/') {
            path.unshift(currentDir.name);
            currentDir = currentDir.parent;
        }
        return path.length ? '/' + path.join('/') : '/';
    }

    renderContents(System.vfs.currentDirectory);
}

function createFileEditor(file) {
    createWindow(`Editor - ${file.name}`);
    const windowBase = document.getElementById(System.AppID);
    const window = windowBase.querySelector('.window-content');
    
    const textarea = document.createElement('textarea');
    textarea.value = file.content;
    textarea.style.width = '90%';
    textarea.style.height = '70%';
    textarea.style.marginBottom = '10px';
    
    const saveButton = document.createElement('button');
    saveButton.textContent = 'Save';
    saveButton.onclick = () => {
        file.updateContent(textarea.value);
        alert('File saved successfully!');
    };
    
    window.appendChild(textarea);
    window.appendChild(saveButton);
}


// Don't remove this, or else nothing will load.
Init();