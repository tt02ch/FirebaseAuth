// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence, sendPasswordResetEmail, signInWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCkp5J4L1j11q4jQ-3IrxVXIANfLj5k32s",
  authDomain: "learn-firebase-auth-20cdb.firebaseapp.com",
  projectId: "learn-firebase-auth-20cdb",
  storageBucket: "learn-firebase-auth-20cdb.appspot.com",
  messagingSenderId: "401276893220",
  appId: "1:401276893220:web:eff48c4b7feebbfa8c80b1"
};

// Initialize Firebase App
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication with persistence
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});

// Function to log in a user
const login = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    console.log('User logged in:', user);
  } catch (error) {
    console.error('Error logging in:', error);
  }
};

// Function to reset password
const resetPassword = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
    console.log('Password reset email sent!');
  } catch (error) {
    console.error('Error sending password reset email:', error);
  }
};

// Monitor authentication state
onAuthStateChanged(auth, (user) => {
  if (user) {
    console.log('User is signed in:', user);
  } else {
    console.log('No user is signed in.');
  }
});

// Export auth, login, and resetPassword functions
export { auth, login, resetPassword };
