'use client';
import { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, type User as FirebaseUser } from 'firebase/auth';
import { doc, onSnapshot, type Firestore } from 'firebase/firestore';

import { useAuth, useFirestore } from '../provider';
import type { UserContextType, UserProfile } from '@/lib/types';

export const UserContext = createContext<UserContextType>({
  user: undefined,
  profile: undefined,
});

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const auth = useAuth();
  const firestore = useFirestore();
  const [user, setUser] = useState<FirebaseUser | null | undefined>(undefined);
  const [profile, setProfile] = useState<UserProfile | null | undefined>(
    undefined
  );

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

    const userDocRef = doc(firestore, `usuarios/${user.uid}`);
    const unsubscribe = onSnapshot(userDocRef, (doc) => {
      if (doc.exists()) {
        setProfile(doc.data() as UserProfile);
      } else {
        setProfile(null);
      }
    });

    return () => unsubscribe();
  }, [user, firestore]);

  return (
    <UserContext.Provider value={{ user, profile }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
