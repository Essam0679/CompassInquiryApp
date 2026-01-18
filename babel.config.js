module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
<<<<<<< HEAD
      // 'expo-router/babel', // This line has been removed/commented out
=======
      'expo-router/babel',
>>>>>>> 8d1b3c625f4e35ee3c88f13c558bfb6f80b500b0
      'react-native-reanimated/plugin',
    ],
  };
};