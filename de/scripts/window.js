// window.js
import { System } from './core.js';
import { updateTaskbar } from './apps/desktop.js';

const windows = [];

function createWindow(title, iconUrl = null, width = '400px', height = '500px') {
    const windowElement = document.createElement("div");
    windowElement.classList.add("window");
    
    // Set the width and height of the window
    windowElement.style.width = width;
    windowElement.style.height = height;

    const titlebar = document.createElement("div");
    titlebar.classList.add("titlebar");
    
    if (iconUrl) {
        const icon = document.createElement("img");
        icon.classList.add("titlebar-icon");
        icon.src = iconUrl;
        icon.alt = "Window Icon";
        titlebar.appendChild(icon);

        const titleSpan = document.createElement("span");
        titleSpan.innerText = title;
        titleSpan.style.marginLeft = "10px";
        titleSpan.style.marginRight = "auto";
        titlebar.appendChild(titleSpan);
    } else {
        const titleSpan = document.createElement("span");
        titleSpan.innerText = title;
        titleSpan.style.marginLeft = "10px";
        titleSpan.style.marginRight = "auto";
        titlebar.appendChild(titleSpan);
    }

    document.body.appendChild(windowElement);
    windowElement.appendChild(titlebar);

    const close = document.createElement("button");
    close.classList.add("titlebar-button");
    const closeImg = document.createElement("img");
    closeImg.src = './Group 2.svg';
    closeImg.style.width = "11px";
    closeImg.style.height = "11px";
    close.appendChild(closeImg);

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
    windowElement.style.zIndex = System.zIndex++;
    windowElement.id = ++System.AppID;

    windows.push({ id: System.AppID, title: title });
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
            highestZIndexWindow.style.zIndex = System.zIndex++;

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
    windowElement.style.zIndex = System.zIndex++;
    const elements = document.querySelectorAll('.titlebar');
    elements.forEach(element => {
      element.classList.add('inactive');
    });
    const titlebar = windowElement.querySelector('.titlebar');
    titlebar.classList.remove('inactive');
    try {
        updateTaskbar();
    } catch (error) {
        console.error(`${error} - Likely because of the desktop not being loaded.`);
    }
}

function unfocusAll() {
    const elements = document.querySelectorAll('.titlebar');
    elements.forEach(element => {
      element.classList.add('inactive');
    });
    try {
        updateTaskbar();
    } catch (error) {
        console.error(`${error} - Likely because of the desktop not being loaded.`);
    }
}

export { unfocusAll, windows, createWindow, bringToFront };