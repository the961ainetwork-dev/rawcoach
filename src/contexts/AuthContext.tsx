import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  signInWithPopup, 
  GoogleAuthProvider,
  User
} from 'firebase/auth';
import { 
  doc, 
  getDoc, 
  setDoc, 
  serverTimestamp 
} from 'firebase/firestore';
import { auth, db, handleFirestoreError, OperationType } from '../lib/firebase';

export interface UserRegistrationProfile {
  uid: string;
  fullName: string;
  email: string;
  role: string;
  companyName: string;
  companyDescription: string;
  phone: string;
  registrationStatus: 'pending' | 'verified' | 'suspended';
  isAdmin: boolean;
  createdAt?: any;
  updatedAt?: any;
}

interface AuthContextType {
  user: User | null;
  profile: UserRegistrationProfile | null;
  loading: boolean;
  isCheckingProfile: boolean;
  logIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, profileData: Omit<UserRegistrationProfile, 'uid' | 'registrationStatus' | 'isAdmin'>) => Promise<void>;
  signUpWithGoogle: () => Promise<void>;
  logOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  setProfileLocal: (profile: UserRegistrationProfile | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserRegistrationProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isCheckingProfile, setIsCheckingProfile] = useState<boolean>(false);

  // Fetch or refresh the current user profile from Firestore
  const fetchProfile = async (uid: string) => {
    setIsCheckingProfile(true);
    const path = `registrations/${uid}`;
    try {
      const snap = await getDoc(doc(db, 'registrations', uid));
      if (snap.exists()) {
        setProfile(snap.data() as UserRegistrationProfile);
      } else {
        setProfile(null);
      }
    } catch (err) {
      console.error("Failed to load profile", err);
      // Suppress or catch nicely
      setProfile(null);
    } finally {
      setIsCheckingProfile(false);
    }
  };

  const refreshProfile = async () => {
    if (user) {
      await fetchProfile(user.uid);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        await fetchProfile(currentUser.uid);
      } else {
        setProfile(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const logIn = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const signUp = async (
    email: string, 
    password: string, 
    profileData: Omit<UserRegistrationProfile, 'uid' | 'registrationStatus' | 'isAdmin'>
  ) => {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    const uid = cred.user.uid;
    const path = `registrations/${uid}`;
    
    // Bootstrapped admin if user email matches the spec email
    const bootstrapAdmin = email.toLowerCase() === "maanbarazy@gmail.com";
    
    const initialProfile: UserRegistrationProfile = {
      uid,
      fullName: profileData.fullName,
      email: email.toLowerCase(),
      role: profileData.role,
      companyName: profileData.companyName,
      companyDescription: profileData.companyDescription || 'No description provided.',
      phone: profileData.phone,
      registrationStatus: bootstrapAdmin ? 'verified' : 'pending',
      isAdmin: bootstrapAdmin,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };

    try {
      await setDoc(doc(db, 'registrations', uid), initialProfile);
      setProfile(initialProfile);
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, path);
    }
  };

  const signUpWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    const cred = await signInWithPopup(auth, provider);
    const uid = cred.user.uid;
    const email = cred.user.email || '';
    const name = cred.user.displayName || 'Google Peer';
    
    // Check if registration already exists
    const snap = await getDoc(doc(db, 'registrations', uid));
    if (!snap.exists()) {
      // Create a pending skeleton profile, user can modify inside their workspace
      const bootstrapAdmin = email.toLowerCase() === "maanbarazy@gmail.com";
      const skeletonProfile: UserRegistrationProfile = {
        uid,
        fullName: name,
        email: email.toLowerCase(),
        role: 'Startup Founder',
        companyName: 'Unnamed Venture',
        companyDescription: 'Provisioned via Google authentication.',
        phone: 'N/A',
        registrationStatus: bootstrapAdmin ? 'verified' : 'pending',
        isAdmin: bootstrapAdmin,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };
      
      try {
        await setDoc(doc(db, 'registrations', uid), skeletonProfile);
        setProfile(skeletonProfile);
      } catch (err) {
        handleFirestoreError(err, OperationType.CREATE, `registrations/${uid}`);
      }
    } else {
      setProfile(snap.data() as UserRegistrationProfile);
    }
  };

  const logOut = async () => {
    await signOut(auth);
    setProfile(null);
  };

  return (
    <AuthContext.Provider value={{
      user,
      profile,
      loading,
      isCheckingProfile,
      logIn,
      signUp,
      signUpWithGoogle,
      logOut,
      refreshProfile,
      setProfileLocal: setProfile
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
