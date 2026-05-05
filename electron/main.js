const { app, BrowserWindow } = require("electron");
const path = require("path");

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      // für die meisten Angular Apps okay; sicherer später feinjustieren
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  // Production: läd die gebaute Angular App aus /dist
  const indexPath = path.join(__dirname, "..", "dist", "LukasAngularZeugs", "browser/index.html");
  win.loadFile(indexPath);
}

app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  // macOS: Apps bleiben oft offen bis Cmd+Q
  if (process.platform !== "darwin") app.quit();
});
