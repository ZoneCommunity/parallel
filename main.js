const path = require("path");
const { app, BrowserWindow } = require("electron");

function createMainWindow() {
  const mainWindow = new BrowserWindow({
    autoHideMenuBar: true,
    title: "parallel",
    width: 2000,
    height: 1600,
    //titleBarStyle: 'hidden'
    //frame: false
    webPreferences: {
      webviewTag: true,
      contextIsolation: false,
      nodeIntegration: true,
    },
  });

  mainWindow.loadFile(path.join(__dirname, "./de/index.html"));
}

app.whenReady().then(() => {
  createMainWindow();
});
