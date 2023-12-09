import { Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from '@angular/fire/auth';
import { Firestore, doc, setDoc } from '@angular/fire/firestore';
import { Storage, ref, uploadBytes, getDownloadURL } from '@angular/fire/storage';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';

export interface UserProfile {
  username: string;
  prenom: string;
  nomDeFamille?: string;
  telephone: string;
  email: string;
  ville?: string;
  dateDeNaissance?: string;
  poids: number | null;
  sexe: 'h' | 'f' | null;
  // autres champs selon votre formulaire
}


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(
    private auth: Auth, 
    private firestore: Firestore,
    private storage: Storage,
    private router: Router,
    private navCtrl: NavController,
    
    ) {}

  async registerUser(email: string, password: string, userProfile: UserProfile, image?: File): Promise<void> {
    try {
      const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);

      if (userCredential.user) {
        const userDocRef = doc(this.firestore, `users/${userCredential.user.uid}`);

        let photoURL = ''; // Initialiser photoURL comme chaîne vide

        // Si une image est fournie, téléchargez-la dans Firebase Storage
        if (image) {
          const imageRef = ref(this.storage, `profilePictures/${userCredential.user.uid}`);
          const uploadResult = await uploadBytes(imageRef, image);
          photoURL = await getDownloadURL(uploadResult.ref);
        }

        const fullName = userProfile.prenom + ' ' + userProfile.nomDeFamille; // Combinez le prénom et le nom de famille
        await setDoc(userDocRef, {
          ...userProfile,
          uid: userCredential.user.uid,
          nom: fullName, // Nom complet de l'utilisateur
          etat: 0, // Valeur initiale pour l'état
          localisation: '', // Valeur initiale pour la localisation
          photoURL: '' // Valeur initiale pour l'URL de la photo
        });

        console.log('Utilisateur enregistré avec succès');
      }
    } catch (error) {
      console.error("Erreur lors de l\'enregistrement de l\'utilisateur:", error);
      throw error;
    }
  }

  async loginUser(email: string, password: string): Promise<void> {
    try {
      await signInWithEmailAndPassword(this.auth, email, password);
      console.log('Connexion réussie');
    } catch (error) {
      console.error('Erreur lors de la connexion:', error);
      throw error;
    }
  }

  async logoutUser(): Promise<void> {
    try {
      await signOut(this.auth);
      console.log('Déconnexion réussie');
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
      throw error;
    }
  }
}