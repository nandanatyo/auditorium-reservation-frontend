declare global {
  interface Window {
    ENV_CONFIG?: {
      VITE_API_URL?: string;
    };
    apiInstance?: any;
    lastApiUrl?: string;
    lastApiHeaders?: any;
    onApiError?: (error: any) => void;
    currentAccessToken?: string;
    lastApiError?: any;

    // Session/Conference related
    currentSortFunction?: (a: any, b: any) => number;
    reloadConferences?: any;
    lastSearchResults?: any;
    lastConferenceSearch?: any;
    customFilter?: any;
    lastCreatedId?: string;

    // Auth related
    adminInfo?: any;
    currentUser?: any;
    autoFillCredentials?: (email: string, password: string) => void;
  }
}

export {};
