#!/usr/bin/env node
/**
 * Sets the default iOS Simulator to iPhone 16 Pro Max.
 * When you run `npx expo start` and press `i`, Expo will open this simulator.
 * Only runs on macOS; no-op on other platforms.
 */

const { execSync } = require('child_process');
const os = require('os');

if (os.platform() !== 'darwin') process.exit(0);

try {
  const json = execSync('xcrun simctl list devices available -j', { encoding: 'utf8' });
  const data = JSON.parse(json);
  const targetName = 'iPhone 16 Pro Max';

  for (const runtime of Object.keys(data.devices)) {
    if (!runtime.startsWith('iOS')) continue;
    const devices = data.devices[runtime] || [];
    const found = devices.find((d) => d.name === targetName);
    if (found && found.udid) {
      execSync(`defaults write com.apple.iphonesimulator CurrentDeviceUDID "${found.udid}"`, {
        stdio: 'pipe',
      });
      console.log(`Default simulator set to ${targetName}`);
      break;
    }
  }
} catch (_) {
  // Ignore errors (e.g. xcrun not found, device not installed)
}
