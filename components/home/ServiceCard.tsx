import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ship, Plane, Truck, Package, Box, FileText } from 'lucide-react-native';

interface ServiceCardProps {
  title: string;
  icon: string;
  onPress: () => void;
  colors: any;
}

export default function ServiceCard({ title, icon, onPress, colors }: ServiceCardProps) {
  const renderIcon = () => {
    switch (icon) {
      case 'ship':
        return <Ship size={24} color={colors.primary} />;
      case 'plane':
        return <Plane size={24} color={colors.primary} />;
      case 'truck':
        return <Truck size={24} color={colors.primary} />;
      case 'package':
        return <Package size={24} color={colors.primary} />;
      case 'box':
        return <Box size={24} color={colors.primary} />;
      case 'file-text':
        return <FileText size={24} color={colors.primary} />;
      default:
        return <Ship size={24} color={colors.primary} />;
    }
  };
  
  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: colors.card }]}
      onPress={onPress}
    >
      <View style={[styles.iconContainer, { backgroundColor: colors.primaryLight }]}>
        {renderIcon()}
      </View>
      <Text style={[styles.title, { color: colors.text }]} numberOfLines={2}>
        {title}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '48%',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    textAlign: 'center',
    height: 40,
  },
});