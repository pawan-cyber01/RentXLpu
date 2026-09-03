import { createContext, useContext, useState, useEffect } from 'react';
import { onAuthStateChanged, RecaptchaVerifier, signInWithPhoneNumber, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [otpSent, setOtpSent] = useState(false);
  const [confirmationResult, setConfirmationResult] = useState(null);
  const [authError, setAuthError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        try {
          const isAdminEmail = firebaseUser.email === 'gamerxmr09@gmail.com';
          const profileDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
          if (profileDoc.exists()) {
            const data = profileDoc.data();
            if (isAdminEmail && !data.isAdmin) {
              await setDoc(doc(db, 'users', firebaseUser.uid), { isAdmin: true }, { merge: true });
              data.isAdmin = true;
            }
            setUserProfile({ id: profileDoc.id, ...data });
          } else {
            // Create new user profile
            const newProfile = {
              name: firebaseUser.displayName || 'Campus Student',
              phoneNumber: firebaseUser.phoneNumber || '',
              email: firebaseUser.email || '',
              profilePhoto: firebaseUser.photoURL || '',
              verified: true,
              rating: 4.8,
              totalDeals: 0,
              status: 'active',
              isAdmin: isAdminEmail,
              createdAt: serverTimestamp(),
              updatedAt: serverTimestamp(),
            };
            await setDoc(doc(db, 'users', firebaseUser.uid), newProfile);
            setUserProfile({ id: firebaseUser.uid, ...newProfile });
          }
        } catch (err) {
          console.error('Error fetching user profile:', err);
        }
      } else {
        setUserProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const setupRecaptcha = (elementId) => {
    try {
      if (window.recaptchaVerifier) {
        window.recaptchaVerifier.clear();
        window.recaptchaVerifier = null;
      }
    } catch (e) {
      console.warn('Error clearing recaptcha:', e);
    }

    const element = document.getElementById(elementId);
    if (!element) {
      console.error('reCAPTCHA container element not found:', elementId);
      return null;
    }

    window.recaptchaVerifier = new RecaptchaVerifier(auth, element, {
      size: 'invisible',
      callback: () => {
        // reCAPTCHA solved
      },
      'expired-callback': () => {
        setAuthError('reCAPTCHA expired. Please try again.');
      },
    });
    return window.recaptchaVerifier;
  };

  const sendOTP = async (phoneNumber) => {
    setAuthError('');
    setAuthLoading(true);
    try {
      const verifier = setupRecaptcha('recaptcha-container');
      if (!verifier) {
        throw new Error('reCAPTCHA container missing. Please refresh.');
      }
      const formattedNumber = phoneNumber.startsWith('+') ? phoneNumber : `+91${phoneNumber}`;
      const result = await signInWithPhoneNumber(auth, formattedNumber, verifier);
      setConfirmationResult(result);
      setOtpSent(true);
      setAuthLoading(false);
      return true;
    } catch (error) {
      console.error('Error sending OTP:', error);
      setAuthError(getErrorMessage(error));
      setAuthLoading(false);
      try {
        if (window.recaptchaVerifier) {
          window.recaptchaVerifier.clear();
          window.recaptchaVerifier = null;
        }
      } catch (e) {}
      return false;
    }
  };

  const verifyOTP = async (otp) => {
    setAuthError('');
    setAuthLoading(true);
    try {
      if (!confirmationResult) {
        throw new Error('No confirmation result');
      }
      await confirmationResult.confirm(otp);
      setOtpSent(false);
      setConfirmationResult(null);
      setAuthLoading(false);
      return true;
    } catch (error) {
      console.error('Error verifying OTP:', error);
      setAuthError(getErrorMessage(error));
      setAuthLoading(false);
      return false;
    }
  };

  const loginWithGoogle = async () => {
    setAuthError('');
    setAuthLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const firebaseUser = result.user;

      const isAdminEmail = firebaseUser.email === 'gamerxmr09@gmail.com';
      const profileDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
      let profile;
      if (profileDoc.exists()) {
        profile = { id: profileDoc.id, ...profileDoc.data() };
        if (isAdminEmail && !profile.isAdmin) {
          await setDoc(doc(db, 'users', firebaseUser.uid), { isAdmin: true }, { merge: true });
          profile.isAdmin = true;
        }
      } else {
        profile = {
          id: firebaseUser.uid,
          name: firebaseUser.displayName || 'Campus Student',
          phoneNumber: firebaseUser.phoneNumber || '',
          email: firebaseUser.email || '',
          profilePhoto: firebaseUser.photoURL || '',
          verified: true,
          rating: 4.8,
          totalDeals: 0,
          status: 'active',
          isAdmin: isAdminEmail,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        };
        await setDoc(doc(db, 'users', firebaseUser.uid), profile);
      }
      setUserProfile(profile);
      setAuthLoading(false);
      return true;
    } catch (error) {
      console.error('Error logging in with Google:', error);
      setAuthError(getErrorMessage(error));
      setAuthLoading(false);
      return false;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setUserProfile(null);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const resetAuth = () => {
    setOtpSent(false);
    setConfirmationResult(null);
    setAuthError('');
    setAuthLoading(false);
    try {
      if (window.recaptchaVerifier) {
        window.recaptchaVerifier.clear();
        window.recaptchaVerifier = null;
      }
    } catch (e) {}
  };

  const updateProfile = async (data) => {
    if (!user) return;
    try {
      await setDoc(doc(db, 'users', user.uid), {
        ...data,
        updatedAt: serverTimestamp(),
      }, { merge: true });
      setUserProfile(prev => ({ ...prev, ...data }));
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  };

  const value = {
    user,
    userProfile,
    loading,
    otpSent,
    authError,
    authLoading,
    sendOTP,
    verifyOTP,
    loginWithGoogle,
    logout,
    resetAuth,
    updateProfile,
    isAuthenticated: !!user,
    isAdmin: userProfile?.isAdmin === true,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

function getErrorMessage(error) {
  if (typeof error === 'string') return error;
  const code = error?.code || '';
  const messages = {
    'auth/operation-not-allowed': 'Phone Authentication is not enabled in Firebase Console. Please enable it in Authentication -> Sign-in method.',
    'auth/invalid-phone-number': 'Please enter a valid 10-digit phone number.',
    'auth/too-many-requests': 'Too many SMS attempts. Please try again later or use a test phone number.',
    'auth/code-expired': 'The OTP has expired. Please request a new one.',
    'auth/invalid-verification-code': 'Invalid OTP. Please check and try again.',
    'auth/network-request-failed': 'Network error. Please check your internet connection.',
    'auth/quota-exceeded': 'SMS quota exceeded for this Firebase project.',
    'auth/captcha-check-failed': 'reCAPTCHA verification failed. Please refresh and try again.',
    'auth/missing-phone-number': 'Please enter your mobile phone number.',
    'auth/app-not-authorized': 'This domain (localhost) is not authorized in Firebase Console -> Authentication -> Settings -> Authorized domains.',
    'auth/argument-error': 'Invalid reCAPTCHA setup. Please refresh the page.',
  };
  return messages[code] || error?.message || 'Something went wrong. Please try again.';
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
