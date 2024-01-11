import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service'; // Assurez-vous que le chemin est correct
import { NavController } from '@ionic/angular';
import { AlertController, LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {
  email: string = '';
  password: string = '';
  showPassword: boolean = false;

  constructor(
    private authService: AuthService,
    private navCtrl: NavController,
    private loadingController: LoadingController,
		private alertController: AlertController,
    ) {}

    //pour afficher ou non le mdp
  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }
    
    async login() {
      const loading = await this.loadingController.create({
        message: 'Connexion en cours...',
        // autres options de configuration du loading, si nécessaire
      });
    
      await loading.present(); // Affiche le chargement
    
      this.authService.loginUser(this.email, this.password)
        .then(async () => {
          console.log('Connexion réussie');
          await loading.dismiss(); // Ferme le chargement
          this.navCtrl.navigateRoot('/home', { animated: false });
        })
        .catch(async error => {
          console.error('Erreur lors de la connexion:', error);
          await loading.dismiss(); // Ferme le chargement même en cas d'erreur
          this.showAlert('Echec de la connexion', 'Email et/ou mot de passe invalide. Veuillez réessayer !');
        });
    }
  async showAlert(header: string, message: string) {
		const alert = await this.alertController.create({
			header,
			message,
			buttons: ['OK']
		});
		await alert.present();
	}
}
