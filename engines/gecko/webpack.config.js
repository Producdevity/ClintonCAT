const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');

const rootPath = path.resolve('./');
const baseConfig = require(`${rootPath}/webpack.config.js`);

module.exports = (env, argv) => {
    return {
        ...baseConfig(env, argv),
        plugins: [
            ...baseConfig(env, argv).plugins,
            new CopyPlugin({
                patterns: [{ from: 'engines/gecko/manifest.json', to: './' }],
            }),
        ],
    };
};
