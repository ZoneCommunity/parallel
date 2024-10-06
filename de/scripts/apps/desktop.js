// desktop.js
import { pm, vfs } from '../core.js';

import { unfocusAll, focusWindow, closeWindow, openWindows } from '../lib/windowManager.js'
import { getBrowserInfo } from '../lib/misc.js'; 

// Apps
import { launchMediaPlayer } from './mediaplayer.js';
import { launchYTMusic } from './ytmusic.js';
import { launchDiscord } from './discord.js';
import { launchVSCode } from './vscode.js';
import { launchPlutoSubsystem } from './plutosubsystem.js';

import { launchLoginScreen, launchSetup } from '../core.js';

function launchDesktop() {
    const desktopProc = pm.createProcess("desktop");
    const desktop = document.createElement('div');
    desktop.style.position = 'fixed';
    desktop.style.top = 0;
    desktop.style.left = 0;
    desktop.style.width = '100%';
    desktop.style.height = '100%';
    desktop.style.backgroundColor = 'rgba(0, 0, 0, 0)';
    desktop.style.fontSize = "20px";
    desktop.style.color = "#000000";
    desktop.style.background = "url('./assets/backgrounds/default.jpg') center/cover no-repeat";
    desktop.style.backgroundSize = "cover";
    desktop.style.padding = "20px";
    desktop.style.paddingTop ="70px";
    const watermark = document.createElement('div');
    watermark.style.position = 'fixed';
    watermark.style.bottom = '65px';
    watermark.style.right = '20px';
    watermark.style.textAlign = 'right';
    watermark.style.color = 'white';
    watermark.style.padding = '5px';
    watermark.style.fontSize = "16px";
    watermark.style.fontWeight = 500;
    watermark.style.textShadow = '0px 2px 20px rgba(0, 0, 0, 0.4)';
    watermark.innerHTML = `parallel Insider<br>
            running on ${getBrowserInfo()}<br>
            updated on 10/6/2024. Build 5 (241006)`;
    desktop.appendChild(watermark);
    document.body.appendChild(desktop);
    desktop.addEventListener("mousedown", (event) => updateX());
    desktop.id = desktopProc.getpID();

    const topBarProc = pm.createProcess("topBar");
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

    topBar.id = topBarProc.getpID();
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

    updateTaskbar();

    launcherShortcut.addEventListener('mouseup', toggleLauncher);

    function toggleLauncher() {
        let launcher = document.getElementById("launcher");
    
        if (launcher !== null) {
            closeLauncher();
        } else {
            launcher = document.createElement("div");
            launcher.id = "launcher";
        
            launcher.style.width = "600px";
            launcher.style.height = "500px";
            launcher.style.backgroundColor = "rgba(255, 255, 255, 0.7)";
            launcher.style.position = "absolute";
            launcher.style.left = "23px";
            launcher.style.top = "-250px";
            launcher.style.transform = "translateY(-50%) translateX(-100%)";
            launcher.style.borderRadius = "4px";
            launcher.style.boxShadow = "0px 4px 60px rgba(0, 0, 0, 0.1)";
            launcher.style.backdropFilter = 'blur(15px)';
            launcher.style.opacity = "0";
            launcher.style.transition = "transform 0.4s cubic-bezier(0.25, 0.8, 0.25, 1), opacity 0.4s ease-in-out";
    
            let username = vfs.readFile('/user/data.zcf');
            username = username.split(',');
            username = username[0];

            launcher.innerHTML = `<h2 style="color:black; padding-top:10px; padding-left:16px;">Hey, ${username}!</h2>
            
            <h4 style="color:black; padding-top:12px; padding-left:16px;">Your apps:</h4>`;

            const shortcutList = document.createElement("ul");

            shortcutList.id = "shortcutList";
            shortcutList.style.listStyleType = "none";
            shortcutList.style.paddingLeft = "7px";
            shortcutList.style.marginTop = "-10px";
        
            const shortcuts = [
                { name: "Logout", action: () => { launcher.remove(); pm.stopProcess(desktopProc.getpID()); pm.stopProcess(topBarProc.getpID()); closeAllWindows(); launchLoginScreen(); } },
                { name: "YouTube Music", action: () => { launchYTMusic(); closeLauncher(); } },
                { name: "Discord", action: () => { launchDiscord(); closeLauncher(); } },
                { name: "Media Player", action: () => { launchMediaPlayer(); closeLauncher(); } },
                { name: "Visual Studio Code", action: () => { launchVSCode(); closeLauncher(); } },
                { name: "Pluto Subsystem", action: () => { launchPlutoSubsystem(); closeLauncher(); } },
                { name: "Reset parallel", action: () => { vfs.reset(); launcher.remove(); pm.stopProcess(desktopProc.getpID()); pm.stopProcess(topBarProc.getpID()); closeAllWindows(); launchSetup(); } },
            ];
        
            shortcuts.forEach(shortcut => {
                const li = document.createElement("li");
                li.textContent = shortcut.name;
                li.style.cursor = "pointer";
                li.style.padding = "10px";
                li.style.color = "black";
                li.addEventListener("click", shortcut.action);
                shortcutList.appendChild(li);
            });
        
            launcher.appendChild(shortcutList);
            topBar.appendChild(launcher);
        
            requestAnimationFrame(() => {
                launcher.style.opacity = "1";
                launcher.style.transform = "translateY(-50%) translateX(0)";
            });
        }     
        
        function closeLauncher() {
            launcher.style.transform = "translateY(-50%) translateX(-100%)";
            launcher.style.opacity = "0";
        
            setTimeout(() => {
                launcher.remove();
            }, 400);
        }

        function closeAllWindows() {
            let windows = document.querySelectorAll(".window");
            if (windows) {
              let curZIndex = [];
              for (let i = 0; i < windows.length; i++) {
                closeWindow(windows[i]);
              }
            }
        }
    }    
}

function updateTaskbar() {
    const middleSection = document.querySelector('.middle-section');
    if (middleSection !== null) {
        middleSection.innerHTML = '';

        openWindows.forEach(window => {
            const tbItem = document.createElement('div');
            tbItem.className = 'inactive';
            tbItem.textContent = window.title;
            tbItem.dataset.windowId = window.id;
            tbItem.onclick = function() {
                const win = document.getElementById(window.id);
                focusWindow(win);
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

    const topBar = document.querySelector('.top-bar');
    if (topBar !== null) {
        let highestZIndex = 0;
        let windows = document.querySelectorAll(".window");
        if (windows) {
          let curZIndex = [];
          for (let i = 0; i < windows.length; i++) {        
            curZIndex.push(Number(windows[i].style.zIndex));
          }
          curZIndex.forEach((element) => {
            if (highestZIndex < element) {
                highestZIndex = element;
            }
          });
        }
    
        topBar.style.zIndex = highestZIndex + 1;
    }
}

function updateX() {
    unfocusAll();
    updateTaskbar();
}

export { launchDesktop, updateTaskbar };
