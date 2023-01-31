export interface ElectronVersion {
  chrome: string;
  node: string;
  electron: string;
  launcher: string;
}

declare global {
  interface Window {
    versions: ElectronVersion;
  }
}
