import { Injectable } from '@angular/core';
import { Firestore, doc, docData, updateDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProfilService {

  constructor(private firestore: Firestore) { }

  // Récupérer les données du profil
  getMonProfil(): Observable<any> {
    const profilRef = doc(this.firestore, 'profil/monprofil');
    return docData(profilRef, { idField: 'id' }) as Observable<any>;
  }

    // Mettre à jour la localisation dans Firestore
    async updateLocalisation(newLocalisation: string): Promise<void> {
      const profilRef = doc(this.firestore, 'profil/monprofil');
      try {
        await updateDoc(profilRef, { localisation: newLocalisation });
        console.log('Localisation mise à jour avec succès');
      } catch (error) {
        console.error('Erreur lors de la mise à jour de la localisation', error);
        throw error;
      }
    }
}
