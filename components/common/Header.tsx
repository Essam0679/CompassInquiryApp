// --- START OF MODIFIED Header.tsx (removing its StatusBar) ---
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native'; // Removed StatusBar from here
import { useRouter } from 'expo-router';
import { useTheme } from '@/context/ThemeContext';
import { ArrowLeft } from 'lucide-react-native';

interface HeaderProps {
  title: string;
  showBackButton?: boolean;
  rightElement?: React.ReactNode;
}

export default function Header({ title, showBackButton = true, rightElement }: HeaderProps) {
  const { colors } = useTheme();
  const router = useRouter();

  const renderRightElement = () => {
    // ... (same as before)
    if (!rightElement) {
      return <View style={styles.placeholderRight} />;
    }
    if (typeof rightElement === 'string') {
      return <Text style={{ color: colors.text, fontFamily: 'Inter-Medium', fontSize: 16 }}>{rightElement}</Text>;
    }
    return rightElement;
  };

  return (
    <View style={[
        styles.header,
        { backgroundColor: colors.backgroundSecondary, borderBottomColor: colors.border }
    ]}>
      {/* StatusBar component removed from here. Root layout will handle it. */}
      <View style={styles.headerContent}>
        {showBackButton ? (
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.canGoBack() ? router.back() : router.replace('/')}
          >
            <ArrowLeft size={24} color={colors.text} />
          </TouchableOpacity>
        ) : (
          <View style={styles.placeholderLeft} />
        )}
        <Text style={[styles.headerTitle, { color: colors.text }]} numberOfLines={1} ellipsizeMode="tail">
          {title}
        </Text>
        {renderRightElement()}
      </View>
    </View>
  );
}

// Styles remain the same, but adjust paddingTop in styles.header if needed
// as react-native StatusBar is removed. The SafeAreaView or root StatusBar
// from expo-status-bar should now manage top spacing.
const styles = StyleSheet.create({
  header: {
    // The paddingTop here was for the react-native StatusBar.
    // If your root layout's SafeAreaView or equivalent handles top spacing,
    // you might not need explicit paddingTop here, or it might need adjustment.
    // Let's assume the root layout handles top SafeArea.
    // paddingTop: Platform.OS === 'ios' ? 40 : 0, // Example: adjust as needed if root doesn't cover it
    height: Platform.OS === 'ios' ? 60 : 56, // A more typical header content height
    justifyContent: 'center', // Vertically center the headerContent
    paddingHorizontal: 16,
    borderBottomWidth: 1,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  backButton: {
    minWidth: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'flex-start',
    // paddingRight: 10, // Keep if needed
  },
  headerTitle: {
    fontFamily: 'Poppins-Bold',
    fontSize: 18,
    textAlign: 'center',
    flexShrink: 1,
    marginHorizontal: 5,
  },
  placeholderLeft: {
    minWidth: 40,
  },
  placeholderRight: {
    minWidth: 40,
  },
});
// --- END OF MODIFIED Header.tsx ---
