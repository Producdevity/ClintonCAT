const path = require('path');
const fs = require('fs');

// Touch the manifest.json file after the build is done to notify the browser that the file has changed
class TouchManifestPlugin {
    apply(compiler) {
        compiler.hooks.done.tap('TouchManifestPlugin', () => {
            const manifestPath = path.resolve(__dirname, 'dist/manifest.json');
            fs.utimes(manifestPath, new Date(), new Date(), () => {});
        });
    }
}

module.exports = TouchManifestPlugin;
