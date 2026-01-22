'use client';
import { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, type User as FirebaseUser } from 'firebase/auth';
import { doc, onSnapshot, type Firestore } from 'firebase/firestore';

import { useAuth, useFirestore } from '../provider';
import type { UserContextType, UserProfile, Affiliate } from '@/lib/types';

export const UserContext = createContext<UserContextType>({
  user: undefined,
  profile: undefined,
  affiliate: undefined,
});

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const auth = useAuth();
  const firestore = useFirestore();
  const [user, setUser] = useState<FirebaseUser | null | undefined>(undefined);
  const [profile, setProfile] = useState<UserProfile | null | undefined>(undefined);
  const [affiliate, setAffiliate] = useState<Affiliate | null | undefined>(undefined);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });
    return () => unsubscribe();
  }, [auth]);

  useEffect(() => {
    if (!user) {
      setProfile(null);
      return;
    }

    const userDocRef = doc(firestore, `users/${user.uid}`);
    const unsubscribe = onSnapshot(userDocRef, (doc) => {
      if (doc.exists()) {
        setProfile(doc.data() as UserProfile);
      } else {
        setProfile(null);
      }
    });

    return () => unsubscribe();
  }, [user, firestore]);

  useEffect(() => {
    if (!user || !profile || !profile.isAffiliate) {
      setAffiliate(null);
      return;
    }

    const affiliateDocRef = doc(firestore, `affiliates/${user.uid}`);
    const unsubscribe = onSnapshot(affiliateDocRef, (doc) => {
      if (doc.exists()) {
        setAffiliate(doc.data() as Affiliate);
      } else {
        setAffiliate(null);
      }
    });

    return () => unsubscribe();
  }, [user, profile, firestore]);

  return (
    <UserContext.Provider value={{ user, profile, affiliate }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  const { user, profile, affiliate } = context;

  return {
      ...context,
      isUserLoading: user === undefined || profile === undefined || (profile?.isAffiliate && affiliate === undefined),
  };
};
