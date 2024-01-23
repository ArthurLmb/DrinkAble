import { Injectable } from '@angular/core';
import { Firestore, doc, docData, updateDoc, setDoc, getDoc } from '@angular/fire/firestore';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from '@angular/fire/auth';
import { Observable } from 'rxjs';
import { getDownloadURL, ref, Storage, uploadString } from '@angular/fire/storage';
import { Photo } from '@capacitor/camera';
import { AlertController, LoadingController } from '@ionic/angular';
import { increment } from 'firebase/firestore';

@Injectable({
  providedIn: 'root'
})
export class ProfilService {

  constructor(
    private firestore: Firestore,
    private auth: Auth, 
    private storage: Storage,
    private loadingController: LoadingController,
		private alertController: AlertController,
    ) { }

  // Récupérer les données du profil
  getMonProfil(): Observable<any> {
    if (this.auth.currentUser) {
      const uid = this.auth.currentUser.uid;
      const profilRef = doc(this.firestore, `users/${uid}`);
      return docData(profilRef, { idField: 'id' }) as Observable<any>;
    } else {
      // Gérez le cas où aucun utilisateur n'est connecté
      throw new Error("Aucun utilisateur connecté");
    }
  }
  


//MAj phot de profil 
async uploadImage(cameraFile: Photo) {
  const user = this.auth.currentUser;
  if (!user) {
    console.error("Aucun utilisateur connecté");
    return null; // ou gérer autrement
  }
  if (!cameraFile.base64String) {
    console.error("Aucune image fournie");
    return null;
  }

  const path = `uploads/${user.uid}/profile.jpg`;
  const storageRef = ref(this.storage, path);

  try {
    await uploadString(storageRef, cameraFile.base64String, 'base64');
    const photoURL = await getDownloadURL(storageRef);
    const userDocRef = doc(this.firestore, `users/${user.uid}`);
    await setDoc(userDocRef, { photoURL }, { merge: true });
    console.log('Image téléchargée avec succès');
    return photoURL;
  } catch (e) {
    console.error('Erreur lors du téléchargement de l\'image', e);
    return null;
  }
}

// Supprimer la photo
async deletePhoto(noPhoto: string): Promise<void> {
  if (this.auth.currentUser) {
    const uid = this.auth.currentUser.uid;
    const profilRef = doc(this.firestore, `users/${uid}`);
    try {
      await updateDoc(profilRef, { photoURL: noPhoto });
      console.log('Photo supprimé');
    } catch (error) {
      console.error('Erreur lors de la suppression de la photo', error);
      this.showAlert('Echec', 'Erreur lors de la suppression de la photo');
      throw error;
    }
  } else {
    // Gérez le cas où aucun utilisateur n'est connecté
    throw new Error("Aucun utilisateur connecté");
  }
}
  

    // Mettre à jour la localisation dans Firestore
    async updateLocalisation(newLocalisation: string): Promise<void> {
      if (this.auth.currentUser) {
        const uid = this.auth.currentUser.uid;
        const profilRef = doc(this.firestore, `users/${uid}`);
        try {
          await updateDoc(profilRef, { localisation: newLocalisation });
          console.log('Localisation mise à jour avec succès');
        } catch (error) {
          console.error('Erreur lors de la mise à jour de la localisation', error);
          this.showAlert('Echec', 'Erreur lors de la mise à jour de la localisation');
          throw error;
        }
      } else {
        // Gérez le cas où aucun utilisateur n'est connecté
        throw new Error("Aucun utilisateur connecté");
      }
    }

     // mettre à jour l'état dans Firestore
     async updateEtat(newEtat: number): Promise<void> {
      if (this.auth.currentUser) {
        const uid = this.auth.currentUser.uid;
        const profilRef = doc(this.firestore, `users/${uid}`);
  
        try {
          await updateDoc(profilRef, { etat: newEtat });
          console.log('Etat mis à jour avec succès');
        } catch (error) {
          console.error('Erreur lors de la mise à jour de l\'état', error);
          throw error;
        }
      } else {
        throw new Error("Aucun utilisateur connecté");
      }
    }

    // Incrémenter le champ "conso"
    async incrementConso(): Promise<void> {
      if (this.auth.currentUser) {
        const uid = this.auth.currentUser.uid;
        const profilRef = doc(this.firestore, `users/${uid}`);
    
        try {
          await updateDoc(profilRef, {
            conso: increment(1) // Utilisez increment de firebase/firestore
          });
          console.log('Conso incrémentée avec succès');
        } catch (error) {
          console.error('Erreur lors de l’incrément de conso', error);
          throw error;
        }
      } else {
        throw new Error("Aucun utilisateur connecté");
      }
    }

    async updateConso(newConsoValue: number): Promise<void> {
      if (this.auth.currentUser) {
        const uid = this.auth.currentUser.uid;
        const profilRef = doc(this.firestore, `users/${uid}`);
    
        try {
          await updateDoc(profilRef, { conso: newConsoValue });
          console.log('Conso mise à jour avec succès');
        } catch (error) {
          console.error('Erreur lors de la mise à jour de conso', error);
          throw error;
        }
      } else {
        throw new Error("Aucun utilisateur connecté");
      }
    }

    async updateTimerData(tempsRestant: number, timestamp: number): Promise<void> {
      if (this.auth.currentUser) {
        const uid = this.auth.currentUser.uid;
        const userRef = doc(this.firestore, `users/${uid}`);
    
        try {
          await updateDoc(userRef, { tempsRestant, timestamp });
          console.log('Données du minuteur mises à jour dans le document de l\'utilisateur');
        } catch (error) {
          console.error('Erreur lors de la mise à jour des données du minuteur', error);
          throw error;
        }
      } else {
        throw new Error("Aucun utilisateur connecté");
      }
    }

    async getTimerData(): Promise<{ tempsRestant: number; timestamp: number }> {
      if (this.auth.currentUser) {
        const uid = this.auth.currentUser.uid;
        const userRef = doc(this.firestore, `users/${uid}`);
    
        try {
          const docSnap = await getDoc(userRef);
          if (docSnap.exists() && docSnap.data()['tempsRestant'] !== undefined && docSnap.data()['timestamp'] !== undefined) {
            const data = docSnap.data();
            return { tempsRestant: data['tempsRestant'], timestamp: data['timestamp'] };
          } else {
            console.log("Aucune donnée de minuteur trouvée");
            return { tempsRestant: 0, timestamp: Date.now() };
          }
        } catch (error) {
          console.error('Erreur lors de la récupération des données du minuteur', error);
          throw error;
        }
      } else {
        throw new Error("Aucun utilisateur connecté");
      }
    }

    // Mettre à jour le numéro de téléphone
  async updateNumeroTelephone(newNumero: string): Promise<void> {
    if (this.auth.currentUser) {
      const uid = this.auth.currentUser.uid;
      const profilRef = doc(this.firestore, `users/${uid}`);
      try {
        await updateDoc(profilRef, { telephone: newNumero });
        console.log('Numéro de téléphone mis à jour avec succès');
      } catch (error) {
        console.error('Erreur lors de la mise à jour du numéro de téléphone', error);
        throw error;
      }
    } else {
      throw new Error("Aucun utilisateur connecté");
    }
  }

  // Mettre à jour le poids
  async updatePoids(newPoids: string): Promise<void> {
    if (this.auth.currentUser) {
      const uid = this.auth.currentUser.uid;
      const profilRef = doc(this.firestore, `users/${uid}`);
      try {
        await updateDoc(profilRef, { poids: newPoids });
        console.log('Poids mis à jour avec succès');
      } catch (error) {
        console.error('Erreur lors de la mise à jour du poids', error);
        throw error;
      }
    } else {
      throw new Error("Aucun utilisateur connecté");
    }
  }

  // Mettre à jour le sexe
  async updateSexe(newSexe: string): Promise<void> {
    if (this.auth.currentUser) {
      const uid = this.auth.currentUser.uid;
      const profilRef = doc(this.firestore, `users/${uid}`);
      try {
        await updateDoc(profilRef, { sexe: newSexe });
        console.log('Sexe mis à jour avec succès');
      } catch (error) {
        console.error('Erreur lors de la mise à jour du sexe', error);
        throw error;
      }
    } else {
      throw new Error("Aucun utilisateur connecté");
    }
  }

  // Mettre à jour la ville
  async updateVille(newVille: string): Promise<void> {
    if (this.auth.currentUser) {
      const uid = this.auth.currentUser.uid;
      const profilRef = doc(this.firestore, `users/${uid}`);
      try {
        await updateDoc(profilRef, { ville: newVille });
        console.log('Ville mise à jour avec succès');
      } catch (error) {
        console.error('Erreur lors de la mise à jour de la ville', error);
        throw error;
      }
    } else {
      throw new Error("Aucun utilisateur connecté");
    }
  }

  // Mettre à jour le nom d'urgence 1
  async updateNomUrgence1(newNomUrgence1: string): Promise<void> {
    if (this.auth.currentUser) {
      const uid = this.auth.currentUser.uid;
      const profilRef = doc(this.firestore, `users/${uid}`);
      try {
        await updateDoc(profilRef, { nameUrgence1: newNomUrgence1 });
        console.log('Nom d\'urgence 1 mis à jour avec succès');
      } catch (error) {
        console.error('Erreur lors de la mise à jour du nom d\'urgence 1', error);
        throw error;
      }
    } else {
      throw new Error("Aucun utilisateur connecté");
    }
  }

// Mettre à jour le numéro d'urgence 1
async updateNumUrgence1(newNumUrgence1: string): Promise<void> {
  if (this.auth.currentUser) {
    const uid = this.auth.currentUser.uid;
    const profilRef = doc(this.firestore, `users/${uid}`);
    try {
      await updateDoc(profilRef, { numUrgence1: newNumUrgence1 });
      console.log('Num d\'urgence 1 mis à jour avec succès');
    } catch (error) {
      console.error('Erreur lors de la mise à jour du num d\'urgence 1', error);
      throw error;
    }
  } else {
    throw new Error("Aucun utilisateur connecté");
  }
}

// Mettre à jour le nom d'urgence 2
async updateNomUrgence2(newNomUrgence2: string): Promise<void> {
  if (this.auth.currentUser) {
    const uid = this.auth.currentUser.uid;
    const profilRef = doc(this.firestore, `users/${uid}`);
    try {
      await updateDoc(profilRef, { nameUrgence2: newNomUrgence2 });
      console.log('Nom d\'urgence 2 mis à jour avec succès');
    } catch (error) {
      console.error('Erreur lors de la mise à jour du nom d\'urgence 2', error);
      throw error;
    }
  } else {
    throw new Error("Aucun utilisateur connecté");
  }
}

// Mettre à jour le numéro d'urgence 2
async updateNumUrgence2(newNumUrgence2: string): Promise<void> {
  if (this.auth.currentUser) {
    const uid = this.auth.currentUser.uid;
    const profilRef = doc(this.firestore, `users/${uid}`);
    try {
      await updateDoc(profilRef, { numUrgence2: newNumUrgence2 });
      console.log('Num d\'urgence 2 mis à jour avec succès');
    } catch (error) {
      console.error('Erreur lors de la mise à jour du num d\'urgence 2', error);
      throw error;
    }
  } else {
    throw new Error("Aucun utilisateur connecté");
  }
}

  // Récupérer le BAC cumulatif
async getBACCumulatif(): Promise<number> {
  if (this.auth.currentUser) {
    const uid = this.auth.currentUser.uid;
    const profilRef = doc(this.firestore, `users/${uid}`);
    const docSnap = await getDoc(profilRef);
    if (docSnap.exists()) {
      return docSnap.data()['bacCumulatif'] || 0; // Retourne 0 si bacCumulatif n'est pas défini
    }
    return 0; // Retourne 0 si le document n'existe pas
  }
  throw new Error("Aucun utilisateur connecté");
}

  async updateBACCumulatif(newBACCumulatif: number): Promise<void> {
    if (this.auth.currentUser) {
      const uid = this.auth.currentUser.uid;
      const profilRef = doc(this.firestore, `users/${uid}`);
      try {
        await updateDoc(profilRef, { bacCumulatif: newBACCumulatif });
        console.log('BAC cumulatif mis à jour avec succès');
      } catch (error) {
        console.error('Erreur lors de la mise à jour du BAC cumulatif', error);
        throw error;
      }
    } else {
      throw new Error("Aucun utilisateur connecté");
    }
  }


//gestion alerte
    async showAlert(header: string, message: string) {
      const alert = await this.alertController.create({
        header,
        message,
        buttons: ['OK']
      });
      await alert.present();
    }
}
