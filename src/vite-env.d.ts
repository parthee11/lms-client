/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_REACT_APP_API_URL: string;
  // Add other environment variables as needed
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

// For runtime environment variables
interface Window {
  env?: {
    REACT_APP_API_URL?: string;
    VITE_REACT_APP_API_URL?: string;
  };
}
