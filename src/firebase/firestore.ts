'use client';
import {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp,
  updateDoc,
  doc,
  setDoc,
} from 'firebase/firestore';
import { initializeFirebase } from '.';
import type { Quote } from '@/lib/types';

const { firebaseApp } = initializeFirebase();
const firestore = getFirestore(firebaseApp);

export async function saveQuote(quoteData: Omit<Quote, 'cotizacionId' | 'fechaCotizacion'>) {
  // Corrected path to save quotes under the user's subcollection
  const quotesCollection = collection(firestore, 'users', quoteData.usuarioId, 'quotes');
  
  const docRef = await addDoc(quotesCollection, {
      ...quoteData,
      fechaCotizacion: serverTimestamp(),
  });

  const cotizacionId = `COT-${new Date().getFullYear()}-${docRef.id.substring(0, 7).toUpperCase()}`;

  // Update the new document with its own generated quote ID
  await updateDoc(docRef, { cotizacionId });
  
  // The 'seguimiento' collection seems to be for internal tracking by the business.
  // The security rules allow creating documents here, so this should be fine.
  const seguimientoRef = doc(firestore, 'seguimiento', docRef.id);
  await setDoc(seguimientoRef, {
      cotizacionId: cotizacionId,
      usuarioId: quoteData.usuarioId,
      estado: 'enviado',
      contactado: false,
      fechaUltimoContacto: null,
      observaciones: 'Cotización generada desde el nuevo cotizador web.'
  });

  return cotizacionId;
}
