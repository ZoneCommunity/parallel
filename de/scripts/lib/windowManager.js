import { pm } from '../core.js';
import { updateTaskbar } from '../apps/desktop.js';

const openWindows = [];
let closingWindows = new Set();

function createWindow(title, width = '400px', height = '500px', resizable = true) {
    const win = document.createElement("div");
    const winProc = pm.createProcess(title);

    // Window
    win.classList.add("window");
    win.style.width = width;
    win.style.height = height;

    // TitleBar
    const titlebar = document.createElement("div");
    titlebar.classList.add("titlebar");
    const titleSpan = document.createElement("span");
    titleSpan.innerText = title;
    titleSpan.style.marginLeft = "10px";
    titleSpan.style.marginRight = "auto";
    titlebar.appendChild(titleSpan);
    titlebar.addEventListener("mousedown", (event) => {
        if (!closingWindows.has(win.id)) {
            moveWindow(event, win);
        }
    });

    // Close Button
    const close = document.createElement("button");
    close.classList.add("titlebar-button");
    const closeImg = document.createElement("img");
    closeImg.src = './assets/window/close_black.svg'
    closeImg.style.width = "11px";
    closeImg.style.height = "11px";
    close.appendChild(closeImg);
    titlebar.appendChild(close);
    close.addEventListener("mouseup", (event) => closeWindow(win));

    // Content Area
    const contentArea = document.createElement("div");
    contentArea.classList.add("window-content");

    // Append Elements
    win.appendChild(titlebar);
    win.appendChild(contentArea);

    if (resizable) {
        makeResizable(win);
    }

    document.body.appendChild(win);

    // Window Properties
    const left = (window.innerWidth - win.offsetWidth) / 2;
    const top = (window.innerHeight - win.offsetHeight) / 2;
    win.style.left = `${left}px`;
    win.style.top = `${top}px`;
    win.classList.add('open');
    win.id = winProc.getpID();
    win.addEventListener("mousedown", (event) => focusWindow(win));

    openWindows.push({ id: winProc.getpID(), title: title });
    focusWindow(win);

    return contentArea;
}

function closeWindow(win) {
    closingWindows.add(win.id);

    const webviewElements = document.getElementsByTagName('webview');
    Array.from(webviewElements).forEach(webview => {
        webview.style.pointerEvents = 'auto';
    });

    let pID = Number(win.id);
    win.classList.remove("open");
    
    const id = parseInt(win.id);
    openWindows.splice(openWindows.findIndex(win => win.id === id), 1);
    updateTaskbar();
    
    setTimeout(() => {
        pm.stopProcess(pID);

        let highestZIndex = 0;
        let highestZIndexWindow = null;
        let windows = document.querySelectorAll(".window");
        
        if (windows) {
            for (let i = 0; i < windows.length; i++) {
                let titlebar = windows[i].querySelector(".titlebar");
                titlebar.classList.add("inactive");
                windows[i].classList.add("inactive");
        
                let currentZIndex = Number(windows[i].style.zIndex);
        
                if (currentZIndex > highestZIndex) {
                    highestZIndex = currentZIndex;
                    highestZIndexWindow = windows[i];
                }
            }
        }

        if (highestZIndexWindow) {
            const titlebar = highestZIndexWindow.querySelector('.titlebar');
            titlebar.classList.remove('inactive');
            highestZIndexWindow.classList.remove("inactive");

            updateTaskbar();
        }

        closingWindows.delete(win.id);
    }, 400);
}

function focusWindow(win) {
    let highestZIndex = 0;
    let windows = document.querySelectorAll(".window");
    if (windows) {
      let curZIndex = [];
      for (let i = 0; i < windows.length; i++) {
        let titlebar = windows[i].querySelector(".titlebar");
        titlebar.classList.add("inactive");
        windows[i].classList.add("inactive");
        
        curZIndex.push(Number(windows[i].style.zIndex));
      }
      curZIndex.forEach((element) => {
        if (highestZIndex < element) {
            highestZIndex = element;
        }
      });
    }
    
    if (parseInt(win.style.zIndex, 10) !== highestZIndex) {
        win.style.zIndex = highestZIndex + 1;
    }
    let titlebar = win.querySelector(".titlebar");
    titlebar.classList.remove("inactive");
    win.classList.remove("inactive");

    updateTaskbar();
}

function unfocusAll() {
    const elements = document.querySelectorAll('.titlebar');
    elements.forEach(element => {
      element.classList.add('inactive');
      element.parentElement.classList.add('inactive');
    });
}

// Window Moving, Resizing, etc..

function moveWindow(event, win) {
    const webviewElements = document.getElementsByTagName('webview');
    Array.from(webviewElements).forEach(webview => {
        webview.style.pointerEvents = 'none';
    });

    let offsetX = event.clientX - win.offsetLeft;
    let offsetY = event.clientY - win.offsetTop;

    function moveAt(pageX, pageY) {
        win.style.left = pageX - offsetX + 'px';
        win.style.top = pageY - offsetY + 'px';
    }

    function onMouseMove(event) {
        moveAt(event.pageX, event.pageY);
    }

    document.addEventListener('mousemove', onMouseMove);

    win.onmouseup = function() {
        Array.from(webviewElements).forEach(webview => {
            webview.style.pointerEvents = 'auto';
        });

        document.removeEventListener('mousemove', onMouseMove);
        win.onmouseup = null;
    };
}

function makeResizable(win) {
    const handles = ['top-left', 'top-right', 'bottom-left', 'bottom-right', 'left', 'right', 'top', 'bottom'];

    handles.forEach(handle => {
        const resizeHandle = document.createElement("div");
        resizeHandle.classList.add("resize-handle", "resize-handle-" + handle);

        resizeHandle.addEventListener('mousedown', function (e) {
            e.stopPropagation();
            e.preventDefault();

            const webviewElements = document.getElementsByTagName('webview');
            Array.from(webviewElements).forEach(webview => {
                webview.style.pointerEvents = 'none';
            });

            focusWindow(win);

            const startX = e.clientX;
            const startY = e.clientY;
            const startRect = win.getBoundingClientRect();

            function doDrag(event) {
                const dx = event.clientX - startX;
                const dy = event.clientY - startY;

                let newWidth = startRect.width;
                let newHeight = startRect.height;
                let newLeft = startRect.left;
                let newTop = startRect.top;

                if (handle.includes('right')) newWidth += dx;
                if (handle.includes('left')) {
                    newWidth -= dx;
                    newLeft += dx;
                }
                if (handle.includes('bottom')) newHeight += dy;
                if (handle.includes('top')) {
                    newHeight -= dy;
                    newTop += dy;
                }

                const minWidth = 200;
                const minHeight = 100;
                if (newWidth < minWidth) {
                    if (handle.includes('left')) newLeft -= minWidth - newWidth;
                    newWidth = minWidth;
                }
                if (newHeight < minHeight) {
                    if (handle.includes('top')) newTop -= minHeight - newHeight;
                    newHeight = minHeight;
                }

                win.style.width = `${newWidth}px`;
                win.style.height = `${newHeight}px`;
                win.style.left = `${newLeft}px`;
                win.style.top = `${newTop}px`;
            }

            function stopDrag() {
                Array.from(webviewElements).forEach(webview => {
                    webview.style.pointerEvents = 'auto';
                });

                document.removeEventListener('mousemove', doDrag);
                document.removeEventListener('mouseup', stopDrag);
            }

            document.addEventListener('mousemove', doDrag);
            document.addEventListener('mouseup', stopDrag);
        });

        win.appendChild(resizeHandle);
    });
}

export { createWindow, unfocusAll, focusWindow, closeWindow, openWindows };