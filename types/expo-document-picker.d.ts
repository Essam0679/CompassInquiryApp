// Custom type declaration for expo-document-picker to override potentially faulty node_modules types
// This ensures TypeScript correctly recognizes the 'type' property and 'assets' array.

declare module 'expo-document-picker' {
  /**
   * Represents a single asset (file) picked by the document picker.
   * Based on expo-document-picker@12.x.x types.
   */
  export interface DocumentPickerAsset {
    /** URI of the picked asset. */
    uri: string;
    /** Name of the picked asset. */
    name: string;
    /** Size of the picked asset in bytes. */
    fileSize?: number;
    /** MIME type of the picked asset. */
    mimeType?: string;
    /** Platform-specific asset ID. */
    assetId?: string;
    /** Last modified date of the asset (Unix timestamp in milliseconds). */
    lastModified?: number;
    // Add other properties if your specific usage needs them (e.g., width, height for images)
  }

  /**
   * Result type when the user successfully picks documents.
   */
  export interface DocumentPickerSuccessResult {
    canceled: false;
    /** An array of picked assets. For `getDocumentAsync` (single pick), this array will contain one item. */
    assets: DocumentPickerAsset[];
  }

  /**
   * Result type when the user cancels the document picking process.
   */
  export interface DocumentPickerCanceledResult {
    canceled: true;
  }

  /**
   * The union type for all possible results from `getDocumentAsync`.
   */
  export type DocumentPickerResult = DocumentPickerSuccessResult | DocumentPickerCanceledResult;

  /**
   * Options for the document picker.
   */
  export interface DocumentPickerOptions {
    /**
     * The MIME type(s) to allow. Defaults to `* / *` (all types).
     * Examples: `image/*`, `application/pdf`, `["image/*", "application/pdf"]`.
     */
    type?: string | string[];
    /**
     * Whether to copy the picked file(s) to the app's cache directory.
     * Defaults to `true` on iOS/Android, `false` on web.
     */
    copyToCacheDirectory?: boolean;
    /**
     * Whether to allow picking multiple documents.
     * Defaults to `false`.
     * Note: If `true`, `result.assets` will contain multiple items.
     */
    multiple?: boolean;
    /**
     * The file extension(s) to allow. Can be a string or array of strings.
     * iOS specific: The `UTI` (Uniform Type Identifier) is used instead of file extension.
     */
    extensions?: string | string[];
    /**
     * **(Web only)** Whether to use a system file picker (default: `true`).
     * If `false`, a custom file input element is used.
     */
    web?: {
      /**
       * **(Web only)** Whether to use a system file picker.
       */
      folders?: boolean;
      /**
       * **(Web only)** Whether to use a system file picker.
       */
      capture?: boolean;
      /**
       * **(Web only)** Additional HTML attributes for the file input element.
       */
      [key: string]: any;
    };
  }

  /**
   * Asks the user to select a document from the system UI.
   *
   * @param options Options for the document picker.
   * @returns A promise that resolves to `DocumentPickerResult`.
   */
  export function getDocumentAsync(
    options?: DocumentPickerOptions
  ): Promise<DocumentPickerResult>;

  // If you also use 'DocumentPicker.TYPE', etc. from the module, you might need to add them here.
  // For most common use cases, getDocumentAsync and the result types are sufficient.
}