import { Injectable } from '@angular/core';
import { Firestore, collection, collectionData, addDoc, deleteDoc, updateDoc, doc, query, where } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ContactService {

  constructor(private firestore: Firestore) { }

  // Récupérer tous les contacts
  getContacts(): Observable<any[]> {
    const contactRef = collection(this.firestore, 'contacts');
    return collectionData(contactRef, { idField: 'id' }) as Observable<any[]>;
  }

  getFavoriteContacts(): Observable<any[]> {
    const contactRef = collection(this.firestore, 'contacts');
    const favQuery = query(contactRef, where('favoris', '==', true));
    return collectionData(favQuery, { idField: 'id' }) as Observable<any[]>;
  }

  // Supprimer un contact
  deleteContact(contactId: string): Promise<void> {
    const contactDocRef = doc(this.firestore, `contacts/${contactId}`);
    return deleteDoc(contactDocRef);
  }

  // Modifier l'état "favoris" d'un contact
  toggleFavoris(contactId: string, isFavoris: boolean): Promise<void> {
    const contactDocRef = doc(this.firestore, `contacts/${contactId}`);
    return updateDoc(contactDocRef, { favoris: !isFavoris });
  }

}
