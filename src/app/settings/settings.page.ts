import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { NavController } from '@ionic/angular';
import { AlertController, LoadingController } from '@ionic/angular';
import { ProfilService } from '../services/profil.service';
import { MaskitoOptions, MaskitoElementPredicateAsync } from '@maskito/core';
import { Keyboard } from '@capacitor/keyboard';
import { PluginListenerHandle } from '@capacitor/core';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {
  isKeyboardVisible: boolean = false;
  private keyboardSubscriptions: PluginListenerHandle[] = [];

  monprofil: any;
  newPoids: string = '';
  newTelephone: string = '';
  newVille: string = '';
  newSexe: string = '';

  newNomUrgence1: string = '';
  newNumUrgence1: string = '';
  newNomUrgence2: string = '';
  newNumUrgence2: string = '';


  constructor(
    private profilService: ProfilService,
    private authService: AuthService,
    private navCtrl: NavController,
    private loadingController: LoadingController,
		private alertController: AlertController,
  ) { }

  monProfil: any;

  // Définition du masque pour le numéro de téléphone
  readonly phoneMask: MaskitoOptions = {
    mask: ['+', /\d/, /\d/,' ', /\d/, /\d/, /\d/, ' ', /\d/, /\d/,' ', /\d/, /\d/,' ', /\d/, /\d/],
  };

  // Fonction pour le prédicat de masquage
  readonly maskPredicate: MaskitoElementPredicateAsync = async (el) => (el as HTMLIonInputElement).getInputElement();

  async ngOnInit() {
    const loading = await this.loadingController.create({
      message: 'Chargement...',
      spinner: 'circles'
    });
    await loading.present();
    this.setupKeyboardListeners();
  
    this.loadUserProfile();
    this.profilService.getMonProfil().subscribe(profil => {
      this.monprofil = profil;
      this.newPoids = this.monprofil?.poids || '';
      this.newVille = this.monprofil?.ville || '';
      this.newTelephone = this.monprofil?.telephone || '';
      this.newNomUrgence1 = this.monprofil?.nameUrgence1 || '';
      this.newNumUrgence1 = this.monprofil?.numUrgence1 || '';
      this.newNomUrgence2 = this.monprofil?.nameUrgence2 || '';
      this.newNumUrgence2 = this.monprofil?.numUrgence2 || '';
    });
    await loading.dismiss();
  }
    

  loadUserProfile() {
    this.profilService.getMonProfil().subscribe(data => {
      this.monProfil = data;
    }, error => {
      console.error('Erreur lors de la récupération du profil:', error);
    });
  }

  private async setupKeyboardListeners() {
    const showListener = await Keyboard.addListener('keyboardWillShow', () => {
      this.isKeyboardVisible = true;
    });
    const hideListener = await Keyboard.addListener('keyboardWillHide', () => {
      this.isKeyboardVisible = false;
    });

    this.keyboardSubscriptions.push(showListener, hideListener);
  }

  async logout() {
    const loading = await this.loadingController.create({
      message: 'Déconnexion en cours...',
      // autres options de configuration du loading, si nécessaire
    });
  
    await loading.present(); // Affiche le chargement
  
    try {
      await this.authService.logoutUser();
      console.log('Déconnexion réussie');
      await loading.dismiss(); // Ferme le chargement
      this.navCtrl.navigateRoot('/login', { animated: false }); // Redirigez vers la page de connexion
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
      await loading.dismiss(); // Ferme le chargement même en cas d'erreur
      // Gérez l'erreur ici, si nécessaire
    }
  }

  async updateProfile() {
    const loading = await this.loadingController.create({
      message: 'Mise à jour du profil...',
      spinner: 'circles'
    });
    await loading.present();
    // Vérifier si l'un des champs est vide
    if (!this.newPoids.trim() || !this.newVille.trim() || !this.newTelephone.trim()) {
    this.showAlert('Erreur', 'Veuillez remplir tous les champs');
    await loading.dismiss();
    return; // Arrêter l'exécution si un champ est vide
    }

    try {
      await Promise.all([
        this.profilService.updateNumeroTelephone(this.newTelephone),
        this.profilService.updatePoids(this.newPoids),
        this.profilService.updateVille(this.newVille)
      ]);
      this.showAlert('Succès', 'Paramètres mis à jour avec succès');
      console.log("Profil mis à jour avec succès");
    } catch (error) {
      this.showAlert('Erreur', 'Erreur lors de la mise à jour du profil');
      console.error("Erreur lors de la mise à jour du profil", error);
    } finally {
      await loading.dismiss();
    }
  }

  // Mise à jour des informations d'urgence 1
async updateUrgence1() {
  try {
    await Promise.all([
      this.profilService.updateNomUrgence1(this.newNomUrgence1),
      this.profilService.updateNumUrgence1(this.newNumUrgence1),
    ]);
    this.showAlert('Succès', 'Informations d\'urgence 1 mises à jour avec succès');
  } catch (error) {
    console.error("Erreur lors de la mise à jour des informations d'urgence 1", error);
    this.showAlert('Erreur', 'Échec de la mise à jour des informations d\'urgence 1');
  }
}

// Mise à jour des informations d'urgence 2
async updateUrgence2() {
  try {
    await Promise.all([
      this.profilService.updateNomUrgence2(this.newNomUrgence2),
      this.profilService.updateNumUrgence2(this.newNumUrgence2),
    ]);
    this.showAlert('Succès', 'Informations d\'urgence 2 mises à jour avec succès');
  } catch (error) {
    console.error("Erreur lors de la mise à jour des informations d'urgence 2", error);
    this.showAlert('Erreur', 'Échec de la mise à jour des informations d\'urgence 2');
  }
}

  //footer
  goHome() {
    this.navCtrl.navigateRoot('/home', { animated: false });
  }
  goDisclaimer() {
    this.navCtrl.navigateRoot('/disclaimer', { animated: false });
  }
  
  openGamificationPage() {
    this.navCtrl.navigateRoot('/gamificationhub', { animated: false });
  }

   //Gestion alerte
   async showAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK']
    });
    await alert.present();
  }

  getEtatColor(etat: number): string {
    switch (etat) {
      case 0:
        return 'green';
      case 1:
        return 'orange';
      case 2:
        return 'red';
      default:
        return 'grey'; // Une couleur par défaut si l'état est inconnu
    }
  }

  ngOnDestroy() {
    this.keyboardSubscriptions.forEach(listenerHandle => listenerHandle.remove());
  }
}
