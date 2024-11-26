import '@testing-library/jest-dom';

jest.mock('firebase/analytics', () => ({
  getAnalytics: jest.fn(),
}));

jest.mock('firebase/auth', () => ({
  getAuth: jest.fn(),
}));

jest.mock('firebase/firestore', () => ({
  getFirestore: jest.fn(),
}));

globalThis.importMeta = {
  env: {
    VITE_FIREBASE_API_KEY: 'test-firebase-api-key',
    VITE_FIREBASE_AUTH_DOMAIN: 'test-auth-domain',
    VITE_FIREBASE_PROJECT_ID: 'test-project-id',
    VITE_FIREBASE_STORAGE_BUCKET: 'test-storage-bucket',
    VITE_FIREBASE_MESSAGING_SENDER_ID: 'test-messaging-sender-id',
    VITE_FIREBASE_APP_ID: 'test-app-id',
    VITE_FIREBASE_MEASUREMENT_ID: 'test-measurement-id',
  },
};
