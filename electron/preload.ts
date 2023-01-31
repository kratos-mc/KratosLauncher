import { ipcRenderer } from "electron";
import { contextBridge } from "electron";

contextBridge.exposeInMainWorld("versions", {
  node: process.versions.node,
  chrome: process.versions.chrome,
  electron: process.versions.electron,
});

contextBridge.exposeInMainWorld("loading", {
  listen: (
    callback: (event: Electron.IpcRendererEvent, ...args: any[]) => void
  ) => ipcRenderer.on("loading:message", callback),
  clean: () => ipcRenderer.removeAllListeners("loading:message"),
});
