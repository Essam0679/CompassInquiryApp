// withRemoveCameraPermission.js
const { withAndroidManifest } = require('@expo/config-plugins');

module.exports = function withRemoveCameraPermission(config) {
  return withAndroidManifest(config, async (modConfig) => {
    const manifest = modConfig.modResults.manifest;

    // Ensure xmlns:tools is present
    if (!manifest.$) {
      manifest.$ = {};
    }
    if (!manifest.$['xmlns:tools']) {
      manifest.$['xmlns:tools'] = 'http://schemas.android.com/tools';
    }

    // Remove uses-permission for CAMERA
    let mainPermissions = manifest['uses-permission'] || [];
    mainPermissions = mainPermissions.filter(
      (p) => p.$['android:name'] !== 'android.permission.CAMERA'
    );
    // Add a specific removal node if it was found and filtered (or to be safe)
    // This tells the merger to explicitly remove any CAMERA permission declaration
    mainPermissions.push({
      $: {
        'android:name': 'android.permission.CAMERA',
        'tools:node': 'remove', // This is the aggressive part
      },
    });
    manifest['uses-permission'] = mainPermissions;

    // Remove uses-feature for camera
    let mainFeatures = manifest['uses-feature'] || [];
    mainFeatures = mainFeatures.filter(
      (f) =>
        f.$['android:name'] !== 'android.hardware.camera' &&
        f.$['android:name'] !== 'android.hardware.camera.autofocus' &&
        f.$['android:name'] !== 'android.hardware.camera.front' &&
        f.$['android:name'] !== 'android.hardware.camera.any' // Common camera features
    );
    // Aggressively remove common camera features
    const featuresToRemove = [
        'android.hardware.camera',
        'android.hardware.camera.autofocus',
        'android.hardware.camera.front',
        'android.hardware.camera.any'
    ];
    featuresToRemove.forEach(featureName => {
        mainFeatures.push({
            $: {
                'android:name': featureName,
                'tools:node': 'remove'
            }
        });
    });

    manifest['uses-feature'] = mainFeatures;
    // Clean up empty uses-feature array if it becomes empty after removals
    if (manifest['uses-feature'] && manifest['uses-feature'].filter(f => !f.$['tools:node'] || f.$['tools:node'] !== 'remove').length === 0) {
        // If only 'remove' nodes are left, or it's empty, we might be able to delete it,
        // but it's safer to leave the remove nodes. If it was empty before adding remove nodes, it's fine.
        // For simplicity, we'll just ensure it's not undefined if it has remove nodes.
    }


    console.log('Attempted AGGRESSIVE removal of CAMERA permission and features using tools:node="remove".');
    return modConfig;
  });
};