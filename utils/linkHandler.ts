// utils/linkHandler.ts
import { Linking, Alert } from 'react-native';

interface OpenLinkParams {
  url: string;
  errorTitle: string;
  cannotOpenMessage: string;
  failedToOpenMessage: string;
}

export const openExternalLink = async ({
  url,
  errorTitle,
  cannotOpenMessage,
  failedToOpenMessage,
}: OpenLinkParams) => {
  try {
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      await Linking.openURL(url);
    } else {
      Alert.alert(errorTitle, `${cannotOpenMessage} ${url}`);
    }
  } catch (error) {
    console.error('Failed to open URL:', error);
    Alert.alert(errorTitle, failedToOpenMessage);
  }
};