let zIndex = 1;
let AppID = 0;
const windows = [];
const desktop = document.createElement('div');

import { VFS } from './vfs.js';


function Init() {
    const vfs = new VFS();
    //vfs.createDirectory('docs');
    //vfs.createFile('hello.txt', 'Hello, World!');
    vfs.changeDirectory('docs');
    //vfs.createFile('wow.md', 'This is the readme file.');
    //console.log(vfs.listContents());
    //vfs.changeDirectory('/');
    //console.log(vfs.listContents());
    //console.log(vfs.readFile('hello.txt'));
    //vfs.writeFile('hello.txt', 'Updated content.');
    //console.log(vfs.readFile('hello.txt'));
    //vfs.removeItem('hello.txt');
    console.log(vfs.readFile('wow.md'));


    desktop.style.position = 'fixed';
    desktop.style.top = 0;
    desktop.style.left = 0;
    desktop.style.width = '100%';
    desktop.style.height = '100%';
    desktop.style.backgroundColor = 'rgba(0, 0, 0, 0)';
    desktop.style.fontSize = "20px";
    desktop.style.color = "#000000";
    desktop.style.padding = "20px";
    desktop.style.paddingTop ="70px";
    const watermark = document.createElement('div');
    watermark.style.position = 'fixed';
    watermark.style.bottom = '15px';
    watermark.style.right = '20px';
    watermark.style.textAlign = 'right';
    watermark.style.color = 'white';
    watermark.style.padding = '5px';
    watermark.style.fontSize = "16px";
    watermark.style.fontWeight = 500;
    watermark.style.textShadow = '0px 2px 20px rgba(0, 0, 0, 0.2)';
    watermark.innerHTML = `parallel Insider<br>
            running on ${getBrowserInfo()}<br>
            finalized on XX/XX/XX. Build 1`;
    desktop.appendChild(watermark);
    document.body.appendChild(desktop);
    desktop.addEventListener("mousedown", (event) => unfocusAll());
    desktop.id = ++AppID;
    console.log(AppID);

    const topBar = document.createElement('div');
    topBar.className = 'top-bar';
    const leftSection = document.createElement('div');
    leftSection.className = 'left-section';
    const launcherShortcut = document.createElement('img');
    launcherShortcut.className = 'home';
    launcherShortcut.src = './assets/desktop/icon.svg';
    launcherShortcut.width = 30;
    launcherShortcut.height = 30;
    leftSection.appendChild(launcherShortcut);
    const middleSection = document.createElement('div');
    middleSection.className = 'middle-section';
    leftSection.appendChild(middleSection);
    topBar.appendChild(leftSection);
    const dateTimeDiv = document.createElement('div');
    dateTimeDiv.className = 'date-time';
    topBar.appendChild(dateTimeDiv);

    topBar.id = ++AppID;
    document.body.appendChild(topBar);

    function updateDateTime() {
        const now = new Date();
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const day = days[now.getDay()];
        const date = now.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        const time = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
        
        dateTimeDiv.innerHTML = `
            <span class="date">${day}, ${date}</span>
            <span class="time">${time}</span>
        `;
    }
    setInterval(updateDateTime, 1000);
    updateDateTime();


    const buttonYas = document.createElement('button');
    buttonYas.innerHTML = "Launch Media Player"
    buttonYas.classList.add("queso");

    buttonYas.onclick = function() {
        createWindow("Media Player");
    
        const windowElement = document.getElementById(AppID);
        const contentArea = windowElement.querySelector('.window-content');
        contentArea.innerHTML = "Now playing sample.mp4";

        const YayButton = document.createElement("button");
        YayButton.innerHTML = "Select a file";
        YayButton.onclick = function() {
            const fileInput = document.createElement('input');
            fileInput.type = 'file';
            fileInput.accept = 'video/*';
            fileInput.onchange = function(event) {
                const file = event.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = function(e) {
                        source.src = e.target.result;
                        video.load();
                        video.loop = true;
                        video.play();
                        contentArea.innerHTML = `Now playing ${file.name}`;
                        contentArea.appendChild(YayButton);
                        contentArea.appendChild(video); 
                    };
                    reader.readAsDataURL(file);
                }
            };
            fileInput.click();
        };
        contentArea.appendChild(YayButton);

            const video = document.createElement('video');
            video.style.marginTop = "10px";
            video.width = 360;
            video.height = 360;
            video.controls = true;
            video.loop = true;
            const source = document.createElement('source');
            source.src = './assets/sample.mp4';
            source.type = 'video/mp4';

            video.appendChild(source);

            contentArea.appendChild(video);
    }

    desktop.appendChild(buttonYas);

    createWindow("System Settings");
    createWindow("Counter");
    const windowElement2 = document.getElementById(AppID);
    const contentArea2 = windowElement2.querySelector('.window-content');
    contentArea2.innerHTML = "Hello world!<br><br>Counter: 0<br><br>";
    let count = 0;
    const CounterButton = document.createElement("button");
    CounterButton.innerHTML = "Increase count";
    CounterButton.onclick = function() {
        count++;
        contentArea2.innerHTML = `Hello world!<br><br>Counter: ${count}<br><br>`;
        contentArea2.appendChild(CounterButton);
    }

    contentArea2.appendChild(CounterButton);

    createWindow("Media Player");
    
        const windowElement = document.getElementById(AppID);
        const contentArea = windowElement.querySelector('.window-content');
        contentArea.innerHTML = "Now playing sample.mp4";

        const YayButton = document.createElement("button");
        YayButton.innerHTML = "Select a file";
        YayButton.onclick = function() {
            const fileInput = document.createElement('input');
            fileInput.type = 'file';
            fileInput.accept = 'video/*';
            fileInput.onchange = function(event) {
                const file = event.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = function(e) {
                        source.src = e.target.result;
                        video.load();
                        video.loop = true;
                        video.play();
                        contentArea.innerHTML = `Now playing ${file.name}`;
                        contentArea.appendChild(YayButton);
                        contentArea.appendChild(video); 
                    };
                    reader.readAsDataURL(file);
                }
            };
            fileInput.click();
        };
        contentArea.appendChild(YayButton);

            const video = document.createElement('video');
            video.style.marginTop = "10px";
            video.width = 360;
            video.height = 360;
            video.controls = true;
            video.loop = true;
            const source = document.createElement('source');
            source.src = './assets/sample.mp4';
            source.type = 'video/mp4';

            video.appendChild(source);

            contentArea.appendChild(video);
}

function createWindow(title) {
    const windowElement = document.createElement("div");
    windowElement.classList.add("window");

    const titlebar = document.createElement("div");
    titlebar.classList.add("titlebar");

    const titleSpan = document.createElement("span");
    titleSpan.innerText = title;
    titlebar.appendChild(titleSpan);

    document.body.appendChild(windowElement);
    windowElement.appendChild(titlebar);

    const close = document.createElement("button");
    close.classList.add("titlebar-button");
    close.innerHTML = "&#10005;";
    close.addEventListener("mousedown", (event) => CloseWindow(windowElement));
    titlebar.appendChild(close);
    titlebar.addEventListener("mousedown", (event) => MoveWindow(event, windowElement));

    const contentArea = document.createElement("div");
    contentArea.classList.add("window-content");
    windowElement.appendChild(contentArea);

    const left = (window.innerWidth - windowElement.offsetWidth) / 2;
    const top = (window.innerHeight - windowElement.offsetHeight) / 2;
    windowElement.style.left = `${left}px`;
    windowElement.style.top = `${top}px`;

    windowElement.classList.add('open');
    windowElement.style.zIndex = zIndex++;
    windowElement.id = ++AppID;

    windows.push({ id: AppID, title: title });
    updateTaskbar();

    bringToFront(windowElement);
    windowElement.addEventListener("mousedown", (event) => bringToFront(windowElement));
}

function CloseWindow(windowElement) {
    windowElement.classList.add('shrink');
    setTimeout(() => {
        const id = parseInt(windowElement.id);
        windows.splice(windows.findIndex(win => win.id === id), 1);
        windowElement.remove();
        const winIndex = document.querySelectorAll('.window');
        let highestZIndex = 0;
        let highestZIndexWindow = null;
        winIndex.forEach(window => {
            const zIndex = parseInt(window.style.zIndex, 10);
            if (zIndex > highestZIndex) {
                highestZIndex = zIndex;
                highestZIndexWindow = window;
            }
        });
        if (highestZIndexWindow) {
            highestZIndexWindow.style.zIndex = zIndex++;

            const elements = document.querySelectorAll('.titlebar');
            elements.forEach(element => {
              element.classList.add('inactive');
            });

            const highestZIndexTitlebar = highestZIndexWindow.querySelector('.titlebar');
            if (highestZIndexTitlebar) {
                highestZIndexTitlebar.classList.remove('inactive');
            }
        }
        updateTaskbar();
    }, 300);
}

function MoveWindow(event, windowElement) {
    let offsetX = event.clientX - windowElement.offsetLeft;
    let offsetY = event.clientY - windowElement.offsetTop;
    function moveAt(pageX, pageY) {
        windowElement.style.left = pageX - offsetX + 'px';
        windowElement.style.top = pageY - offsetY + 'px';
    }
    function onMouseMove(event) {
        moveAt(event.pageX, event.pageY);
    }
    document.addEventListener('mousemove', onMouseMove);

    windowElement.onmouseup = function() {
        document.removeEventListener('mousemove', onMouseMove);
        windowElement.onmouseup = null;
    };
}

function bringToFront(windowElement) {
    windowElement.style.zIndex = zIndex++;
    const elements = document.querySelectorAll('.titlebar');
    elements.forEach(element => {
      element.classList.add('inactive');
    });
    const titlebar = windowElement.querySelector('.titlebar');
    titlebar.classList.remove('inactive');
    updateTaskbar();
}

function unfocusAll() {
    const elements = document.querySelectorAll('.titlebar');
    elements.forEach(element => {
      element.classList.add('inactive');
    });
    updateTaskbar();
}

function updateTaskbar() {
    const middleSection = document.querySelector('.middle-section');
    middleSection.innerHTML = '';

    windows.forEach(window => {
        const tbItem = document.createElement('div');
        tbItem.className = 'inactive';
        tbItem.textContent = window.title;
        tbItem.dataset.windowId = window.id;
        tbItem.onclick = function() {
            const windowElement = document.getElementById(window.id);
            bringToFront(windowElement);
        };
        middleSection.appendChild(tbItem);
    });

    const activeWindow = document.querySelector('.titlebar:not(.inactive)');
    if (activeWindow) {
        const activeId = parseInt(activeWindow.parentElement.id);
        const activeTbItem = Array.from(middleSection.children).find(item => parseInt(item.dataset.windowId) === activeId);
        if (activeTbItem) {
            activeTbItem.classList.remove('inactive');
            activeTbItem.classList.add('active');
        }
    }
}


function getBrowserInfo() {
    const ua = navigator.userAgent;
    let browserName = "Unknown";
    let browserVersion = "";
    let os = "Unknown";
    if (ua.indexOf("Win") != -1) os = "Windows";
    else if (ua.indexOf("Mac") != -1) os = "macOS";
    else if (ua.indexOf("Linux") != -1) os = "Linux";
    else if (ua.indexOf("Android") != -1) os = "Android";
    else if (ua.indexOf("like Mac") != -1) os = "iOS";
    if (ua.indexOf("Firefox") != -1) {
      browserName = "Firefox";
      browserVersion = ua.match(/Firefox\/(\d+\.\d+)/)[1];
    } else if (ua.indexOf("Chrome") != -1) {
      browserName = "Chrome";
      browserVersion = ua.match(/Chrome\/(\d+\.\d+)/)[1];
    } else if (ua.indexOf("Safari") != -1) {
      browserName = "Safari";
      browserVersion = ua.match(/Version\/(\d+\.\d+)/)[1];
    } else if (ua.indexOf("MSIE") != -1 || ua.indexOf("Trident/") != -1) {
      browserName = "Internet Explorer";
      browserVersion = ua.match(/(MSIE\s|rv:)(\d+\.\d+)/)[2];
    }
    return `${os} with ${browserName} ${browserVersion}`;
}
