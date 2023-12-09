import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { MaskitoOptions, MaskitoElementPredicateAsync } from '@maskito/core';
import { AuthService, UserProfile } from '../services/auth.service'; 
import { AlertController, LoadingController } from '@ionic/angular';


@Component({
  selector: 'app-inscription',
  templateUrl: './inscription.page.html',
  styleUrls: ['./inscription.page.scss'],
})
export class InscriptionPage implements OnInit {

  userProfile: UserProfile = {
    username: '',
    prenom: '',
    nomDeFamille: '',
    telephone: '',
    email: '',
    ville: '',
    dateDeNaissance: '',
    poids: null,
    sexe: null,
  };
  password: string ='';
  confirmPassword: string ='';
  selectedImage: File | null = null;
  showPassword: boolean = false; // Pour gérer la visibilité du mot de passe
  constructor(
    private navCtrl: NavController,
    private authService: AuthService,
    private loadingController: LoadingController,
		private alertController: AlertController,
  ) { }


  onFileChanged(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedImage = input.files[0];
    } else {
      this.selectedImage = null;
    }
  }

  async register() {
    // Vérifier si les mots de passe correspondent
    if (this.password !== this.confirmPassword) {
      console.error('Les mots de passe ne correspondent pas');
      this.showAlert('Erreur', 'Les mots de passe ne correspondent pas');
      return;
    }
  
    const loading = await this.loadingController.create({
      message: 'Inscription en cours...',
      // autres options de configuration du loading, si nécessaire
    });
  
    await loading.present(); // Affiche le chargement
  
    try {
      await this.authService.registerUser(this.userProfile.email, this.password, this.userProfile);
      console.log('Inscription réussie');
      await loading.dismiss(); // Ferme le chargement
      this.showAlert("Inscription réussie", "Bienvenue sur Drink'Able !");
      this.navCtrl.navigateRoot('/home', { animated: false });
      // Redirection ou autres actions après une inscription réussie
    } catch (error) {
      console.error('Erreur lors de l\'inscription:', error);
      await loading.dismiss(); // Ferme le chargement même en cas d'erreur
      this.showAlert('Erreur', 'Échec de l\'inscription');
    }
  }
  


  openLoginPage() {
    this.navCtrl.navigateRoot('/login', { animated: false });
  }


  // Définition du masque pour le numéro de téléphone
  readonly phoneMask: MaskitoOptions = {
    mask: ['+', /\d/, /\d/,' ', /\d/, /\d/, /\d/, ' ', /\d/, /\d/,' ', /\d/, /\d/,' ', /\d/, /\d/],
  };
  // Définition du masque pour le numéro de téléphone
  readonly birthdateMask: MaskitoOptions = {
    mask: [/\d/, /\d/,'/', /\d/, /\d/, '/', /\d/, /\d/,/\d/, /\d/,],
  };
  // Fonction pour le prédicat de masquage
  readonly maskPredicate: MaskitoElementPredicateAsync = async (el) => (el as HTMLIonInputElement).getInputElement();

  ngOnInit() {
  }

  //pour afficher ou non le mdp
  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  goHome() {
    this.navCtrl.navigateRoot('/home', { animated: false });
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
