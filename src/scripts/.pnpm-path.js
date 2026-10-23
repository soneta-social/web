// @ts-check
// Resolves playwright-core from the pnpm store (it is not hoisted to the root
// node_modules) and exposes a preconfigured browser launcher.

const {chromium} = require(process.cwd() + '/node_modules/.pnpm/playwright@1.61.1/node_modules/playwright-core');
const os = require('os');
const path = require('path');

const HEADLESS_SHELL = path.join(
  os.homedir(), 'Library/Caches/ms-playwright/chromium_headless_shell-1228/chrome-headless-shell-mac-arm64/chrome-headless-shell'
);
const CHROME = path.join(
  os.homedir(), 'Library/Caches/ms-playwright/chromium-1228/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing'
);

module.exports = {
  chromium,
  launchHeadlessShell: () => chromium.launch({executablePath: HEADLESS_SHELL}),
  launchChrome: () => chromium.launch({executablePath: CHROME})
};
