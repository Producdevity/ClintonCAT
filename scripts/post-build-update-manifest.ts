import { resolve } from 'path';
import { readFileSync, writeFileSync } from 'fs';

const rootPath = resolve('./');
const packageJson = require(`${rootPath}/package.json`);
const baseManifestJson = require(`${rootPath}/engines/common/manifest.json`);
const manifestFilePath = resolve(__dirname, `${rootPath}/dist/manifest.json`);

try {
    // Read the manifest file
    let manifest = JSON.parse(readFileSync(manifestFilePath, 'utf-8'));

    // Get the following values from package.json
    manifest.version = packageJson.version;
    manifest.description = packageJson.description;
    manifest = { ...manifest, ...baseManifestJson };

    // Write the updated manifest file
    writeFileSync(manifestFilePath, JSON.stringify(manifest, null, 2));

    console.log(`Version updated to ${packageJson.version} in manifest.json.`);
} catch (error) {
    if (error instanceof Error) {
        console.error(`Error updating manifest.json: ${error.message}`);
    } else {
        console.error('Unknown error updating manifest.json');
    }
}
