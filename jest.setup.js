jest.mock('./src/services/firebase', () => ({
  firebaseErrorMessage: () => 'Firebase is unavailable in Jest.',
  loadUserProfile: jest.fn(),
  logOut: jest.fn(),
  registerAccount: jest.fn(),
  sendPasswordReset: jest.fn(),
  signIn: jest.fn(),
  subscribeToAuth: (callback) => {
    callback(null);
    return jest.fn();
  },
}));

jest.mock('./src/services/location', () => ({
  getAttendanceLocation: jest.fn(),
}));