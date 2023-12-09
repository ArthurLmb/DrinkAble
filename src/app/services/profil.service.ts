import { Injectable } from '@angular/core';
import { Firestore, doc, docData, updateDoc, setDoc } from '@angular/fire/firestore';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from '@angular/fire/auth';
import { Observable } from 'rxjs';
import { getDownloadURL, ref, Storage, uploadString } from '@angular/fire/storage';
import { Photo } from '@capacitor/camera';
import { AlertController, LoadingController } from '@ionic/angular';

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

  const path = `uploads/${user.uid}/profile.webp`;
  const storageRef = ref(this.storage, path);

  try {
    await uploadString(storageRef, cameraFile.base64String, 'base64');
    const imageUrl = await getDownloadURL(storageRef);
    const userDocRef = doc(this.firestore, `users/${user.uid}`);
    await setDoc(userDocRef, { imageUrl }, { merge: true });
    console.log('Image téléchargée avec succès');
    return imageUrl;
  } catch (e) {
    console.error('Erreur lors du téléchargement de l\'image', e);
    return null;
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
