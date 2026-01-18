// metro.config.js
const { getDefaultConfig } = require('expo/metro-config');

const defaultConfig = getDefaultConfig(__dirname);

// You can customize the config here if needed
// For example, to add custom asset extensions:
// defaultConfig.resolver.assetExts.push('cjs');

module.exports = defaultConfig;