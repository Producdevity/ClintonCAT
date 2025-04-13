const fs = require('fs');
const path = require('path');

// Workaround for Chrome not detecting background script updates
class ReloadExtensionPlugin {
    apply(compiler) {
        compiler.hooks.done.tap('ReloadExtensionPlugin', () => {
            const reloaderPath = path.resolve(__dirname, '../dist/background.js');

            if (fs.existsSync(reloaderPath)) {
                console.log('🔄 Triggering Chrome Extension Reload...');
                fs.utimes(reloaderPath, new Date(), new Date(), () => {});
            }
        });
    }
}

module.exports = ReloadExtensionPlugin;
