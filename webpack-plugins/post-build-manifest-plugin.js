const { exec } = require('child_process');

// Run manifest update after Webpack finishes
class PostBuildManifestPlugin {
    apply(compiler) {
        compiler.hooks.done.tap('PostBuildManifestPlugin', () => {
            exec('npx tsx scripts/post-build-update-manifest.ts', (err, stdout, stderr) => {
                if (err) {
                    console.error(`❌ Error updating manifest: ${stderr}`);
                } else {
                    console.log(`✅ Manifest updated: ${stdout}`);
                }
            });
        });
    }
}

module.exports = PostBuildManifestPlugin;
