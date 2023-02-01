/**
 * Test if the process.platform is `darwin` (macos)
 * @returns true if the current platform is `darwin`, false otherwise
 */
export function isMacos() {
  return process.platform === "darwin";
}

/**
 * Test if the process.platform is `win32` (macos)
 * @returns true if the current platform is `win32`, false otherwise
 */
export function isWindows() {
  return process.platform === "win32";
}

/***
 * Test if the process.platform is `linux`
 * @returns true if the current platform is `linux`, false otherwise
 */
export function isLinux() {
  return process.platform === "linux";
}
