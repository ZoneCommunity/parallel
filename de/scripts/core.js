// core.js
import { VFS, Directory, File } from './vfs.js';
let System = {
    AppID: 0,
    zIndex: 1,
    vfs: new VFS()
};
export { System };
import { LaunchDesktop } from './apps/desktop.js';
import { createWindow } from './window.js';
import { launchMediaPlayer } from './apps/mediaplayer.js';

function Init() {
    LaunchDesktop();
    createWindow("Counter");
    let WindowBase = document.getElementById(System.AppID);
    let Window = WindowBase.querySelector('.window-content');
    Window.innerHTML = "Hello world!<br><br>Counter: 0<br><br>";
    let count = 0;
    let CounterButton = document.createElement("button");
    CounterButton.innerHTML = "Increase count";
    CounterButton.onclick = function() {
        count++;
        Window.innerHTML = `Hello world!<br><br>Counter: ${count}<br><br>`;
        Window.appendChild(CounterButton);
    }
    Window.appendChild(CounterButton);

    createWindow("Firefox", "./firefox.png");

    createFileBrowser();
    launchMediaPlayer();

    //Window.appendChild(win);


    //System.vfs.changeDirectory('docs');
    //System.vfs.changeDirectory('life');
    console.log(System.vfs.listContents());
    //System.vfs.changeDirectory('..');
    //console.log(System.vfs.listContents());
    //console.log(System.vfs.readFile('wow.md'));
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