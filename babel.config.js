module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      // 'expo-router/babel', // This line has been removed/commented out
      'react-native-reanimated/plugin',
    ],
  };
};
