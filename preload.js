const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("malakor", {
  boostOn: () => ipcRenderer.invoke("boost:on"),
  boostOff: () => ipcRenderer.invoke("boost:off"),
  acceptAgreement: () => ipcRenderer.invoke("agreement:accept"),
  closeApp: () => ipcRenderer.send("app:close")
});
