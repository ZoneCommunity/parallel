import { processManager } from './lib/processManager.js';
import { createWindow, closeWindow } from './lib/windowManager.js';
import VFS from './lib/vfs.js';

const vfs = new VFS();

// Apps
import { launchDesktop } from './apps/desktop.js';

const pm = new processManager();

let desktopProc;
let topBarProc;

function init() {
    console.log("Booting parallel...");

    if (!vfs.exists('/parallel.zcf')) {
        console.log("Time to setup!");
        launchSetup();
    } else {
        console.log("Login experience");
        launchLoginScreen();
    }

    //launchDesktop();
    //launchYTMusic();
}

function launchSetup() {
    loadBar();

    let contentArea = createWindow("parallel Setup", "1000px", "700px", false);

    contentArea.innerHTML = `
        <h2>Welcome to the parallel Setup!</h2>
        <p>
            parallel is a modern and simple web based desktop environment.
        </p>

        <p>You will:
            <ul style="list-style-type: none; padding-left: 20px;">
                <li style="text-indent: 20px;">Create a user account</li>
            </ul>
        </p>

        <button id="nextButton" style="position: absolute; bottom: 10px; right: 10px;">Next</button>
    `;

    let nextButton = document.getElementById('nextButton');
    nextButton.addEventListener('mouseup', nextStep1);
    
    function nextStep1() {
        contentArea.innerHTML = `
            <h2>Create a user account.</h2>
            <div style="margin-bottom: 20px;">
                <label for="username">Username:</label>
                <input type="text" id="username"><br>

                <label for="password" style="margin-top: 10px;">Password:</label>
                <input type="password" id="password">
            </div>

            <button id="nextButton" style="position: absolute; bottom: 10px; right: 10px;">Next</button>
        `;

        nextButton = document.getElementById('nextButton');
        nextButton.addEventListener('mouseup', nextStep2);
    }

    function nextStep2() {
        let username = document.getElementById('username').value;
        let password = document.getElementById('password').value;

        if (username === "" || password === "") {
            alert("Your username/password cannot be blank!");
        } else {
            vfs.createFile('/parallel.zcf', 'true');
            vfs.createDirectory('/user');

            vfs.createFile('/user/data.zcf', `${username},${password}`);

            contentArea.innerHTML = `
                <h2>Almost complete!</h2>
                <p>Press next to complete the setup!</P>

                <button id="nextButton" style="position: absolute; bottom: 10px; right: 10px;">Next</button>
            `;

            nextButton = document.getElementById('nextButton');
            nextButton.addEventListener('mouseup', nextStep3);
        }
    }

    function nextStep3() {
        closeWindow(contentArea.parentElement);

        pm.stopProcess(desktopProc.getpID());
        pm.stopProcess(topBarProc.getpID());

        launchLoginScreen();
    }
}

function launchLoginScreen() {
    loadBar();

    let contentArea = createWindow("Login to parallel", "400px", "300px", false);

    let win = contentArea.parentElement;
    let titleBar = win.querySelector('.titlebar');
    let closeButton = titleBar.querySelector('.titlebar-button');

    closeButton.remove();

    let username = vfs.readFile('/user/data.zcf');
    username = username.split(',');
    let password = username[1];
    username = username[0];

    contentArea.innerHTML = `
        <h2>Welcome, ${username}!</h2>
        <div style="margin-bottom: 20px;">
            <label for="password" style="margin-top: 10px;">Password:</label>
            <input type="password" id="password">
        </div>
        <br><br>
        <p><em>I forgot my password..</em></p>
    `;

    let passwordBox = document.getElementById('password');

    passwordBox.addEventListener('keydown', function(event) {
        if (event.key === "Enter") {
            if (passwordBox.value == password) {
                pm.stopProcess(desktopProc.getpID());
                pm.stopProcess(topBarProc.getpID());

                closeWindow(win);

                launchDesktop();
            } else {
                alert("Incorrect password!");
            }
        }
    });
}

function loadBar() {
    desktopProc = pm.createProcess("desktop");
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
    desktop.id = desktopProc.getpID();
    document.body.append(desktop);
    
    topBarProc = pm.createProcess("topBar");
    const topBar = document.createElement('div');
    topBar.className = 'top-bar';

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
}

init();

export { pm, launchLoginScreen, vfs, launchSetup };