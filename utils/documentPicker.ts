import * as DocumentPicker from 'expo-document-picker';

export interface DocumentInfo {
  uri: string;
  name: string;
  size: number;
  mimeType: string;
}

export async function pickDocument(): Promise<DocumentInfo | null> {
  try {
    const result = await DocumentPicker.getDocumentAsync({
      type: [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'image/*'
      ],
      multiple: false
    });

    if (result.canceled || !result.assets || result.assets.length === 0) {
      return null;
    }

    const file = result.assets[0];
    return {
      uri: file.uri,
      name: file.name,
      size: file.fileSize || 0,
      mimeType: file.mimeType || 'application/octet-stream'
    };
  } catch (error) {
    console.error('Error picking document:', error);
    return null;
  }
}