import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Router } from '@angular/router';
import { MaskitoOptions, MaskitoElementPredicateAsync } from '@maskito/core';
import { AuthService, UserProfile } from '../../services/auth.service'; 
import { AlertController, LoadingController } from '@ionic/angular';
import { Camera, CameraDirection, CameraResultType, CameraSource, Photo } from '@capacitor/camera';
import { ProfilService } from '../../services/profil.service';


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
  selectedCity: string = '';
  customCity: string = '';
  showCustomCityField: boolean = false;

  password: string ='';
  confirmPassword: string ='';
  showPassword: boolean = false; // Pour gérer la visibilité du mot de passe
  
  selectedImage: Photo | null = null;
  
  constructor(
    private navCtrl: NavController,
    private router: Router,
    private authService: AuthService,
    private loadingController: LoadingController,
		private alertController: AlertController,
    private profilService: ProfilService,
  ) { }

  async selectImage() {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: true,
      direction: CameraDirection.Front,
      resultType: CameraResultType.Base64,
      source: CameraSource.Prompt,
      promptLabelPhoto:'Choisir depuis la gallerie',
      promptLabelPicture: 'Prendre une photo',
    });

    if (image) {
      this.selectedImage = image;
    }
  }


  onCityChange() {
    this.showCustomCityField = this.selectedCity === 'Autre';
    if (!this.showCustomCityField) {
      this.userProfile.ville = this.selectedCity;
    }
  }

  onSexeChange(event: any) {
    if (event.detail.value === 'autre') {
      this.showSexeAlert();
    }
  }

  async showSexeAlert() {
    const alert = await this.alertController.create({
      header: 'Attention',
      message: "En choisissant 'Autre', notre compteur d'alcoolémie sera moins précis.",
      buttons: ["J'ai compris"]
    });
    await alert.present();
  }

  async register() {
    // Vérifier si les mots de passe correspondent
    if (this.password !== this.confirmPassword) {
      console.error('Les mots de passe ne correspondent pas');
      this.showAlert('Erreur', 'Les mots de passe ne correspondent pas');
      return;
    }
  
    // Si l'utilisateur a choisi "Autre", assignez la ville personnalisée
    if (this.showCustomCityField) {
      this.userProfile.ville = this.customCity;
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
      if (this.selectedImage) {
        await this.profilService.uploadImage(this.selectedImage);
      }
      this.router.navigateByUrl('/disclaimer');
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
  // Définition du masque pour la date de naissance
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
