/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  // This is not regex but micromatch.
  // https://github.com/micromatch/micromatch#extended-globbing
  testMatch: [`**/test/*.test.ts?(x)`]
};
