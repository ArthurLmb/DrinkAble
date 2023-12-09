import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { NavController } from '@ionic/angular';
import { AlertController, LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage {

  constructor(
    private authService: AuthService,
    private navCtrl: NavController,
    private loadingController: LoadingController,
		private alertController: AlertController,
  ) { }

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

  //footer
  goHome() {
    this.navCtrl.navigateRoot('/home', { animated: false });
  }
  
  openGamificationPage() {
    this.navCtrl.navigateRoot('/gamificationhub', { animated: false });
  }

}
