import { View, Image, StyleSheet, useWindowDimensions, Platform } from 'react-native';
import { useState } from 'react';

export default function LogoHeader() {
  const { width } = useWindowDimensions();
  const [imageError, setImageError] = useState(false);
  
  // Calculate logo width based on screen size
  const getLogoWidth = () => {
    if (width >= 1024) return width * 0.4; // Desktop
    if (width >= 768) return width * 0.6;  // Tablet
    return width * 0.8;                    // Mobile
  };

  // Use direct raw GitHub URL
  const logoUrl = 'https://raw.githubusercontent.com/Essam0679/HostingHUB/main/Compass%20Ocean%20Logistics%20Logo.jpg';

  return (
    <View style={styles.container}>
      <Image
        source={{ uri: logoUrl }}
        style={[styles.logo, { width: getLogoWidth() }]}
        resizeMode="contain"
        accessibilityLabel="Compass Ocean Logistics Logo"
        loading={Platform.OS === 'web' ? 'lazy' : undefined}
        onError={() => setImageError(true)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingVertical: 32,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  logo: {
    height: 160, // Doubled from 80 to 160
  },
});