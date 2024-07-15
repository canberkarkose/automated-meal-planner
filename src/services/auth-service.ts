import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  browserSessionPersistence,
  setPersistence,
  sendPasswordResetEmail,
  confirmPasswordReset
} from 'firebase/auth';

import {
  doc,
  setDoc,
  collection,
  query,
  where,
  getDocs,
  getDoc
} from 'firebase/firestore';

import { app, db } from '../firebase-config';

const auth = getAuth(app);

export const checkUsernameAvailabilityHttp = async (username: string): Promise<boolean> => {
  try {
    const response = await fetch('https://us-central1-bite-by-bite-thesis.cloudfunctions.net/checkUsernameAvailabilityHttp', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username }),
    });
    const data = await response.json();
    return data.available;
  } catch (error) {
    console.error('Error checking username availability:', error);
    throw error;
  }
};

export const createUserAndAuthenticate = async (email: string, password: string) => {
  try {
    await setPersistence(auth, browserSessionPersistence);
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    console.error('Authentication failed:', error);
    throw error;
  }
};

export const setUserDocument = async (uid: string, username: string, email: string) => {
  try {
    await setDoc(doc(db, 'users', uid), {
      uid, username, email, accountDetailsCompleted: false
    });
  } catch (error) {
    console.error('Setting user document failed:', error);
    throw error;
  }
};

export const signUp = async (email: string, username: string, password: string) => {
  if (!(await checkUsernameAvailabilityHttp(username))) {
    throw new Error('Username is already taken');
  }

  try {
    const user = await createUserAndAuthenticate(email, password);
    await setUserDocument(user.uid, username, email);
    return user;
  } catch (error) {
    console.error('Sign up failed:', error);
    throw error;
  }
};

const checkIfUserExists = async (userId: string): Promise<boolean> => {
  const docRef = doc(db, 'users', userId);
  const docSnap = await getDoc(docRef);

  return docSnap.exists();
};

export const googleSignIn = async () => {
  await setPersistence(auth, browserSessionPersistence);
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({
    prompt: 'select_account'
  });

  const result = await signInWithPopup(auth, provider);
  const { user } = result;
  const { email } = user;
  let username = email?.split('@')[0];

  const existingUser = await checkIfUserExists(user.uid);
  if (username && !existingUser) {
    const isUsernameAvailable = await checkUsernameAvailabilityHttp(username);

    if (username && !isUsernameAvailable) {
      username += Math.floor(Math.random() * 1000);
    }

    await setDoc(doc(db, 'users', user.uid), {
      username,
      email,
      accountDetailsCompleted: false
    });
  }

  return { user, isNewUser: !existingUser };
};

const validateEmail = (rawEmail: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(rawEmail);

export const login = async (usernameOrEmail: string, password: string) => {
  await setPersistence(auth, browserSessionPersistence);
  if (validateEmail(usernameOrEmail)) {
    try {
      return await signInWithEmailAndPassword(auth, usernameOrEmail, password);
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  } else {
    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('username', '==', usernameOrEmail));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      throw new Error('No user found with the given username.');
    }

    let userEmail = '';
    querySnapshot.forEach((docSnapshot) => {
      userEmail = docSnapshot.data().email;
    });

    try {
      return await signInWithEmailAndPassword(auth, userEmail, password);
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  }
};

export const resetPassword = async (email: string) => {
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (error) {
    console.error('Error sending password reset email:', error);
    throw error;
  }
};

export const confirmPassword = async (oobCode: string, newPassword: string) => {
  try {
    await confirmPasswordReset(auth, oobCode, newPassword);
  } catch (error) {
    console.error('Error confirming new password:', error);
    throw error;
  }
};
