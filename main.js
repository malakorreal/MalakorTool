const { app, BrowserWindow, Tray, Menu, ipcMain, screen } = require("electron");
const path = require("path");
const { exec } = require("child_process");
const RPC = require("discord-rpc");
const Store = require("electron-store");

const CLIENT_ID = "1451081256623276104";
const iconPath = path.join(__dirname, "png/slogo2.ico");
const store = new Store();

const BOOST_ON_CMD = [
  "powercfg /setactive 8c5e7fda-e8bf-4a96-9a85-a6e23a8c635c",
  "powercfg -setacvalueindex 8c5e7fda-e8bf-4a96-9a85-a6e23a8c635c 54533251-82be-4824-96c1-47b60b740d00 893dee8e-2bef-41e0-89c6-b55d0929964c 100",
  "powercfg -setacvalueindex 8c5e7fda-e8bf-4a96-9a85-a6e23a8c635c 54533251-82be-4824-96c1-47b60b740d00 bc5038f7-23e0-4960-96da-33abaf5935ec 100",
  "powercfg -setacvalueindex 8c5e7fda-e8bf-4a96-9a85-a6e23a8c635c 501a4d13-42af-4429-9fd1-a8218c268e20 ee12f906-d277-404b-b6da-e5fa1a576df5 0"
].join("; ");

let win;
let tray;
let rpc;

app.disableHardwareAcceleration();

// ---------- PowerShell ----------
function runPS(cmd) {
  return new Promise((resolve, reject) => {
    exec(
      `powershell -NoProfile -ExecutionPolicy Bypass -Command "${cmd}"`,
      { windowsHide: true },
      (error) => {
        if (error) reject(error.message);
        else resolve(true);
      }
    );
  });
}

// ---------- Window ----------
function createWindow() {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;

  win = new BrowserWindow({
    width: Math.min(1280, width),
    height: Math.min(800, height),
    minWidth: 1100,
    minHeight: 720,
    frame: false,
    resizable: true,
    backgroundColor: "#0b0f1a",
    icon: iconPath,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  const accepted = store.get("agreementAccepted", false);
  win.loadFile(
    path.join(
      __dirname,
      accepted ? "src/index.html" : "src/agreement.html"
    )
  );

  win.center();

  win.on("close", (e) => {
    if (!app.isQuiting) {
      e.preventDefault();
      win.hide();
    }
  });
}

// ---------- Tray ----------
function createTray() {
  tray = new Tray(iconPath);
  tray.setToolTip("MalakorTool");

  tray.setContextMenu(
    Menu.buildFromTemplate([
      { label: "Open", click: () => win.show() },
      { type: "separator" },
      {
        label: "Exit",
        click: () => {
          app.isQuiting = true;
          app.quit();
        }
      }
    ])
  );

  tray.on("click", () => {
    if (!win) return;
    if (win.isVisible()) {
      win.focus();
    } else {
      win.show();
    }
  });
}

// ---------- Discord RPC ----------
function initRPC() {
  rpc = new RPC.Client({ transport: "ipc" });
  rpc.on("ready", () => {
    rpc.setActivity({
      details: "กำลังใช้ Malakor's Tool",
      state: "กําลังใช้งาน Malakor's Booster",
      largeImageKey: "starhublogo",
      largeImageText: "MalakorTool",
      buttons: [
        { label: "Made By Malakor", url: "https://guns.lol/malakorkubb" }
      ],
      instace:true
    });
  });
  rpc.login({ clientId: CLIENT_ID }).catch(() => {});
}

// ---------- IPC ----------
ipcMain.handle("boost:on", async () => {
  try {
    await runPS(BOOST_ON_CMD);
    return { ok: true };
  } catch (e) {
    return { ok: false };
  }
});

ipcMain.handle("boost:off", async () => {
  try {
    await runPS("powercfg /setactive 381b4222-f694-41f0-9685-ff5bb260df2e");
    return { ok: true };
  } catch (e) {
    return { ok: false };
  }
});

ipcMain.handle("agreement:accept", () => {
  store.set("agreementAccepted", true);
  win.loadFile(path.join(__dirname, "src/index.html"));
});

ipcMain.on("app:close", () => {
  app.isQuiting = true;
  app.quit();
});

// ---------- App ----------
app.whenReady().then(() => {
  createWindow();
  createTray();
  initRPC();
});
