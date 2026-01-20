'use client';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
} from 'firebase/auth';
import { doc, setDoc, getFirestore, serverTimestamp } from 'firebase/firestore';
import { initializeFirebase } from '.';

const { firebaseApp } = initializeFirebase();
const auth = getAuth(firebaseApp);
const firestore = getFirestore(firebaseApp);

export async function signUp(email: string, password: string, nombre: string, telefono: string) {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;

  if (user) {
    const userProfile = {
      uid: user.uid,
      nombre,
      correo: user.email,
      telefono,
      fechaRegistro: new Date().toISOString(),
      estado: 'activo',
    };
    await setDoc(doc(firestore, 'usuarios', user.uid), userProfile);
  }
  return userCredential;
}

export function signIn(email: string, password: string) {
  return signInWithEmailAndPassword(auth, email, password);
}

export function signOut() {
  return firebaseSignOut(auth);
}
