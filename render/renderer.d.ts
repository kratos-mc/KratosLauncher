export interface ElectronVersion {
  chrome: string;
  node: string;
  electron: string;
  launcher: string;
}

export interface ElectronLoadingIpc {
  listen: (
    callback: (event: Electron.IpcRendererEvent, ...args: any[]) => void
  ) => Electron.IpcRenderer;
  clean: () => void;
}

export interface ElectronLauncherIpc {
  toggleMaximizeWindow: () => void;
}

declare global {
  interface Window {
    versions: ElectronVersion;
    loading: ElectronLoadingIpc;
    launcher: ElectronLauncherIpc;
  }
}
