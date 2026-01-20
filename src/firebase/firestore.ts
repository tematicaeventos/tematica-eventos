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
  const quotesCollection = collection(firestore, 'cotizaciones');
  
  const docRef = await addDoc(quotesCollection, {
      ...quoteData,
      fechaCotizacion: serverTimestamp(),
  });

  const cotizacionId = `COT-${new Date().getFullYear()}-${docRef.id.substring(0, 7).toUpperCase()}`;

  await updateDoc(docRef, { cotizacionId });
  
  // Create tracking document
  const seguimientoRef = doc(firestore, 'seguimiento', docRef.id);
  await setDoc(seguimientoRef, {
      cotizacionId: cotizacionId,
      usuarioId: quoteData.usuarioId,
      estado: 'enviado',
      contactado: false,
      fechaUltimoContacto: null,
      observaciones: 'Cotización generada desde la web.'
  });

  return cotizacionId;
}
