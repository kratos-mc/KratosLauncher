/**
 * Test whether the `process.env.NODE_ENV` is production.
 *
 * @returns true if the process.env.NODE_ENV is production
 */
export function isProduction(): boolean {
  return process.env.NODE_ENV === `production`;
}


export function isTesting(): boolean {
  return process.env.CI === 'e2e';
}