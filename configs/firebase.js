// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence, sendPasswordResetEmail, signInWithEmailAndPassword, onAuthStateChanged, GithubAuthProvider, GoogleAuthProvider } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import * as AuthSession from 'expo-auth-session';

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

// Initialize providers
const githubProvider = new GithubAuthProvider();
const googleProvider = new GoogleAuthProvider();

// Function to log in a user with email and password
const login = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    console.log('User logged in:', user);
    return user;
  } catch (error) {
    console.error('Error logging in:', error);
    throw error;
  }
};

// Function to log in a user with GitHub
const loginWithGitHub = async () => {
  const redirectUri = AuthSession.makeRedirectUri({ useProxy: true });
  
  const authUrl = `https://github.com/login/oauth/authorize?client_id=Ov23lis2LvuPL24LIW1e&redirect_uri=${redirectUri}&scope=user`;

  const result = await AuthSession.startAsync({ authUrl });

  if (result.type === 'success') {
    const { code } = result.params;
    
    const credential = GithubAuthProvider.credential(code);
    
    try {
      const userCredential = await auth.signInWithCredential(credential);
      const user = userCredential.user;
      console.log('User logged in with GitHub:', user);
      return user;
    } catch (error) {
      console.error('Error signing in with credential:', error);
      throw error;
    }
  } else {
    console.error('Login canceled or failed:', result);
  }
};

// Function to log in a user with Google
const loginWithGoogle = async () => {
  const redirectUri = AuthSession.makeRedirectUri({ useProxy: true });
  
  const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=YOUR_GOOGLE_CLIENT_ID&redirect_uri=${redirectUri}&response_type=code&scope=email`;

  const result = await AuthSession.startAsync({ authUrl });

  if (result.type === 'success') {
    const { code } = result.params;
    const credential = GoogleAuthProvider.credential(code);

    try {
      const userCredential = await auth.signInWithCredential(credential);
      const user = userCredential.user;
      console.log('User logged in with Google:', user);
      return user;
    } catch (error) {
      console.error('Error signing in with Google:', error);
      throw error;
    }
  } else {
    console.error('Login canceled or failed:', result);
  }
};

// Function to reset password
const resetPassword = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
    console.log('Password reset email sent!');
  } catch (error) {
    console.error('Error sending password reset email:', error);
    throw error;
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

// Export auth, login, loginWithGitHub, loginWithGoogle, and resetPassword functions
export { auth, login, loginWithGitHub, loginWithGoogle, resetPassword };
