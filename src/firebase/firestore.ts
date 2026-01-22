'use client';
import {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp,
  updateDoc,
  doc,
  setDoc,
  writeBatch,
} from 'firebase/firestore';
import { initializeFirebase } from '.';
import type { Quote, Affiliate } from '@/lib/types';

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
      observaciones: 'Cotización generada desde el nuevo cotizador web.' + (quoteData.observaciones ? `\n\nObservaciones del cliente: ${quoteData.observaciones}` : '')
  });

  return cotizacionId;
}

export async function saveAffiliateData(userId: string, affiliateData: Omit<Affiliate, 'userId' | 'createdAt' | 'affiliateCode'>) {
  const affiliateRef = doc(firestore, 'affiliates', userId);
  const userRef = doc(firestore, 'users', userId);

  const firstNamePart = affiliateData.firstName.replace(/\s/g, '').substring(0, 4).toUpperCase();
  const affiliateCode = `${firstNamePart}${userId.substring(0, 4).toUpperCase()}`;

  const finalAffiliateData = {
      ...affiliateData,
      userId,
      affiliateCode,
      createdAt: new Date().toISOString(),
  };

  const batch = writeBatch(firestore);

  batch.set(affiliateRef, finalAffiliateData);
  batch.update(userRef, { isAffiliate: true, affiliateCode });

  await batch.commit();

  return affiliateCode;
}

type AffiliateUpdatePayload = Omit<Affiliate, 'userId' | 'createdAt' | 'affiliateCode'>;

export async function updateAffiliateData(userId: string, data: AffiliateUpdatePayload) {
  const affiliateRef = doc(firestore, 'affiliates', userId);
  const userRef = doc(firestore, 'users', userId);

  const batch = writeBatch(firestore);

  // Update affiliate document with all fields from the form
  batch.update(affiliateRef, { ...data });

  // Update corresponding fields in user profile document to keep them in sync
  batch.update(userRef, {
    nombre: `${data.firstName} ${data.lastName}`,
    correo: data.email,
    telefono: data.phone,
  });

  await batch.commit();
}
