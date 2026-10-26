import { getAuth } from '@react-native-firebase/auth';
import {
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from '@react-native-firebase/auth';
import type { User as FirebaseUser } from '@react-native-firebase/auth';
import {
  collection,
  doc,
  getDoc,
  getFirestore,
  onSnapshot,
  orderBy,
  query,
  runTransaction,
  serverTimestamp,
  setDoc,
} from '@react-native-firebase/firestore';

const auth = getAuth();
const firestore = getFirestore();

export type UserProfile = {
  uid: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  createdAt?: unknown;
};

export type AttendanceLocation = {
  latitude: number;
  longitude: number;
  accuracy: number | null;
};

export type StoredAttendance = {
  id: string;
  dateKey: string;
  checkInAt: Date;
  checkOutAt: Date | null;
  checkInLocation: AttendanceLocation;
  checkOutLocation: AttendanceLocation | null;
  workedMinutes: number | null;
};

type RegisterInput = {
  fullName: string;
  email: string;
  phoneNumber: string;
  password: string;
};

function profileFromAuth(user: FirebaseUser): UserProfile {
  return {
    uid: user.uid,
    fullName: user.displayName || '',
    email: user.email || '',
    phoneNumber: user.phoneNumber || '',
  };
}

export function getCurrentUser() {
  return auth.currentUser;
}

export function subscribeToAuth(callback: (user: FirebaseUser | null) => void) {
  return auth.onAuthStateChanged(callback);
}

export async function registerAccount({ fullName, email, phoneNumber, password }: RegisterInput) {
  const credential = await createUserWithEmailAndPassword(auth, email.trim().toLowerCase(), password);
  const user = credential.user;

  await updateProfile(user, { displayName: fullName.trim() });

  const profile: UserProfile = {
    uid: user.uid,
    fullName: fullName.trim(),
    email: user.email || email.trim().toLowerCase(),
    phoneNumber: phoneNumber.trim(),
  };

  await setDoc(doc(firestore, 'users', user.uid), {
    ...profile,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  return profile;
}

export async function signIn(email: string, password: string) {
  const credential = await signInWithEmailAndPassword(auth, email.trim().toLowerCase(), password);
  return loadUserProfile(credential.user);
}

export async function loadUserProfile(user: FirebaseUser) {
  const snapshot = await getDoc(doc(firestore, 'users', user.uid));
  if (!snapshot.exists()) return profileFromAuth(user);

  const data = snapshot.data();
  return {
    ...profileFromAuth(user),
    ...data,
    uid: user.uid,
    fullName: typeof data.fullName === 'string' ? data.fullName : user.displayName || '',
    email: typeof data.email === 'string' ? data.email : user.email || '',
    phoneNumber: typeof data.phoneNumber === 'string' ? data.phoneNumber : '',
  } as UserProfile;
}

export async function sendPasswordReset(email: string) {
  return sendPasswordResetEmail(auth, email.trim().toLowerCase());
}

export async function logOut() {
  return signOut(auth);
}

function getLocalDateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function timestampToDate(value: unknown): Date | null {
  if (value instanceof Date) return value;
  if (value && typeof (value as { toDate?: () => Date }).toDate === 'function') {
    return (value as { toDate: () => Date }).toDate();
  }
  return null;
}

export function subscribeToAttendance(
  uid: string,
  onRecords: (records: StoredAttendance[]) => void,
  onError: (error: unknown) => void,
) {
  const attendanceQuery = query(
    collection(firestore, 'users', uid, 'attendance'),
    orderBy('dateKey', 'desc'),
  );

  return onSnapshot(attendanceQuery, snapshot => {
    const records = snapshot.docs.flatMap(document => {
      const data = document.data();
      const checkInAt = timestampToDate(data.checkInAt);
      const location = data.checkInLocation as AttendanceLocation | undefined;
      if (!checkInAt || !location || typeof location.latitude !== 'number' || typeof location.longitude !== 'number') return [];
      return [{
        id: document.id,
        dateKey: typeof data.dateKey === 'string' ? data.dateKey : document.id,
        checkInAt,
        checkOutAt: timestampToDate(data.checkOutAt),
        checkInLocation: location,
        checkOutLocation: (data.checkOutLocation as AttendanceLocation | null | undefined) ?? null,
        workedMinutes: typeof data.workedMinutes === 'number' ? data.workedMinutes : null,
      }];
    });
    onRecords(records);
  }, onError);
}

export async function checkInWithLocation(uid: string, location: AttendanceLocation) {
  const dateKey = getLocalDateKey(new Date());
  const attendanceRef = doc(firestore, 'users', uid, 'attendance', dateKey);
  await runTransaction(firestore, async transaction => {
    const existing = await transaction.get(attendanceRef);
    if (existing.exists()) {
      throw Object.assign(new Error('Attendance is already recorded for today.'), { code: 'attendance/already-recorded' });
    }
    transaction.set(attendanceRef, {
      uid,
      dateKey,
      checkInAt: serverTimestamp(),
      checkInLocation: location,
      checkOutAt: null,
      checkOutLocation: null,
      workedMinutes: null,
      updatedAt: serverTimestamp(),
    }, { merge: true });
  });
}

export async function checkOutWithLocation(uid: string, location: AttendanceLocation) {
  const dateKey = getLocalDateKey(new Date());
  const attendanceRef = doc(firestore, 'users', uid, 'attendance', dateKey);
  await runTransaction(firestore, async transaction => {
    const existing = await transaction.get(attendanceRef);
    if (!existing.exists() || !existing.data().checkInAt || existing.data().checkOutAt) {
      throw Object.assign(new Error('You are not checked in for today.'), { code: 'attendance/not-checked-in' });
    }
    const checkInAt = timestampToDate(existing.data().checkInAt);
    if (!checkInAt) throw new Error('Could not read the check-in time. Please try again.');
    const workedMinutes = Math.max(0, Math.floor((Date.now() - checkInAt.getTime()) / 60000));
    transaction.update(attendanceRef, {
      checkOutAt: serverTimestamp(),
      checkOutLocation: location,
      workedMinutes,
      updatedAt: serverTimestamp(),
    });
  });
}

export function firebaseErrorMessage(error: unknown) {
  const code = (error as { code?: string })?.code;
  switch (code) {
    case 'auth/email-already-in-use': return 'An account with this email already exists. Try signing in.';
    case 'auth/invalid-email': return 'Enter a valid email address.';
    case 'auth/invalid-credential':
    case 'auth/user-not-found':
    case 'auth/wrong-password': return 'The email or password is incorrect.';
    case 'auth/weak-password': return 'Choose a stronger password with at least 8 characters.';
    case 'auth/network-request-failed': return 'Could not connect. Check your internet and try again.';
    case 'firestore/permission-denied': return 'Firebase blocked this request. Check your Firestore security rules.';
    case 'attendance/already-recorded': return 'Attendance is already recorded for today.';
    case 'attendance/not-checked-in': return 'Check in before checking out.';
    case 'location/permission-denied': return 'Allow location access to record attendance.';
    case 'location/unavailable': return 'Could not get your location. Turn on device location and try again.';
    default: return 'Something went wrong. Please try again.';
  }
}