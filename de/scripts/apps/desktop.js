// desktop.js
import { System } from '../core.js';
import { getBrowserInfo } from '../apps/misc.js'; 
import { unfocusAll, windows, bringToFront } from '../window.js';

function LaunchDesktop() {
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
    watermark.style.bottom = '15px';
    watermark.style.right = '20px';
    watermark.style.textAlign = 'right';
    watermark.style.color = 'white';
    watermark.style.padding = '5px';
    watermark.style.fontSize = "16px";
    watermark.style.fontWeight = 500;
    watermark.style.textShadow = '0px 2px 20px rgba(0, 0, 0, 0.4)';
    watermark.innerHTML = `parallel Insider<br>
            running on ${getBrowserInfo()}<br>
            updated on 9/30/2024. Build 2 (240930)`;
    desktop.appendChild(watermark);
    document.body.appendChild(desktop);
    desktop.addEventListener("mousedown", (event) => unfocusAll());
    desktop.id = ++System.AppID;

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

    topBar.id = ++System.AppID;
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

export { LaunchDesktop, updateTaskbar };
