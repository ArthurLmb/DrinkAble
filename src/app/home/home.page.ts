import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { PopoverController, ToastController } from '@ionic/angular';
import { BullepopoverComponent } from '../bullepopover/bullepopover.component';
import { ContactService } from '../services/contact.service';
import { ProfilService } from '../services/profil.service';
import { NavController } from '@ionic/angular';
import { ModalController } from '@ionic/angular';
import { IonicSlides } from '@ionic/angular';
import { AuthService } from '../services/auth.service';
import { AlertController, LoadingController } from '@ionic/angular';
import { Camera, CameraDirection, CameraResultType, CameraSource } from '@capacitor/camera';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  swiperModules = [IonicSlides];
  slides: any[] = [];
  contacts: any[] = [];
  monprofil: any;
  popoverEvent: any;
  currentFilter: string = 'all'; // 'all' ou 'favorites'
  newLocalisation: string = '';
  defaultPhoto: string = '';

  constructor(
    private router: Router,
    private navCtrl: NavController,
    private contactService: ContactService,
    private profilService: ProfilService,
    private popoverController: PopoverController,
    private modalController: ModalController,
    private authService: AuthService,
    private loadingController: LoadingController,
		private alertController: AlertController,
    private toastController: ToastController,
    
    ) {}
    monProfil: any;

    ngOnInit() {
      this.slides =[
        {ads: 'assets/perso/adsamples/1.png' },
        {ads: 'assets/perso/adsamples/2.png' },
        {ads: 'assets/perso/adsamples/3.png' },
        {ads: 'assets/perso/adsamples/4.png' },
        {ads: 'assets/perso/adsamples/5.png' },
        {ads: 'assets/perso/adsamples/6.png' },
        {ads: 'assets/perso/adsamples/7.png' },
        {ads: 'assets/perso/adsamples/8.png' },
      ]
      this.loadAllContacts();
      this.loadUserProfile();
      this.profilService.getMonProfil().subscribe(profil => {
        this.monprofil = profil;
        this.newLocalisation = this.monprofil?.localisation || '';
      });
    }

    getGreeting() {
      const hour = new Date().getHours();
      const salutation = (hour >= 18 || hour < 6) ? 'Bonsoir' : 'Bonjour';
      return `${salutation} ${this.monprofil?.prenom}`;
    }

    loadUserProfile() {
      this.profilService.getMonProfil().subscribe(data => {
        this.monProfil = data;
      }, error => {
        console.error('Erreur lors de la récupération du profil:', error);
      });
    }

//bouton test ajout conso

async setEtatToTwo() {
  if (this.monProfil) {
    try {
      await this.profilService.updateEtat(2);
      await this.presentToastForEtatRed();
      console.log("L'état a été mis à jour à 2");
    } catch (error) {
      console.error("Erreur lors de la mise à jour de l'état à 2", error);
    }
  } else {
    console.error("Profil non chargé ou non existant");
  }
}

async presentToastForEtatRed() {
  const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const toastThemeWarningClass = isDarkMode ? 'toast-light-theme-warning' : 'toast-dark-theme-warning';

  const toast = await this.toastController.create({
    header: 'Attention !',
    message: 'Vous êtes probablement trop alcoolisé pour prendre la route.',
    position: 'top',
    duration: 5000,
    cssClass: toastThemeWarningClass,
  });
  toast.present();
}




  //header
  openContactPage() {
    this.router.navigateByUrl('/contact'); // Assurez-vous que cette route est définie dans votre configuration de routage
  }

  loadAllContacts() {
    this.contactService.getContacts().subscribe(contacts => {
      this.contacts = contacts;
    });
  }

  loadFavoriteContacts() {
    this.contactService.getFavoriteContacts().subscribe(contacts => {
      this.contacts = contacts;
    });
  }

  applyFilter(filter: string) {
    this.currentFilter = filter; // Mettre à jour le filtre actuel
    if (filter === 'favorites') {
      this.loadFavoriteContacts();
    } else {
      this.loadAllContacts();
    }
    this.popoverController.dismiss();
  }

  //Modification profil

  async onUpdateInfos() {
    try {
      await this.profilService.updateLocalisation(this.newLocalisation);
      // Réinitialisez le champ d'entrée ou effectuez d'autres actions nécessaires.
      this.newLocalisation = '';
      this.showAlert('Succès', 'Localisation mise à jour avec succès');
      this.modalController.dismiss();
    } catch (error) {
      // Gérez les erreurs ici, par exemple, affichez un message d'erreur à l'utilisateur.
    }
  }

  async onDeletePhoto() {
    const confirmed = await this.showDeleteConfirmation();
    if (confirmed) {
      try {
        await this.profilService.deletePhoto(this.defaultPhoto);
        this.defaultPhoto = '';
        this.showAlert('Succès', 'Photo supprimée');
      } catch (error) {
        // Gérez les erreurs ici, par exemple, affichez un message d'erreur à l'utilisateur.
      }
    }
  }

  async showDeleteConfirmation(): Promise<boolean> {
    return new Promise(async (resolve) => {
      const alert = await this.alertController.create({
        header: 'Confirmer',
        message: 'Êtes-vous sûr de vouloir supprimer cette photo ?',
        buttons: [
          {
            text: 'Annuler',
            role: 'cancel',
            handler: () => resolve(false)
          },
          {
            text: 'Supprimer',
            handler: () => resolve(true)
          }
        ]
      });
  
      await alert.present();
    });
  }

  async dismissModal() {
    await this.modalController.dismiss();
  }

  async changeImageFromGallery() {
		const image = await Camera.getPhoto({
			quality: 90,
			allowEditing: true,
      direction: CameraDirection.Front,
			resultType: CameraResultType.Base64,
			source: CameraSource.Photos // Camera, Photos or Prompt!
		});

		if (image) {
			const loading = await this.loadingController.create();
			await loading.present();

			const result = await this.profilService.uploadImage(image);
			loading.dismiss();

			if (!result) {
				const alert = await this.alertController.create({
					header: 'Upload failed',
					message: 'There was a problem uploading your avatar.',
					buttons: ['OK']
				});
				await alert.present();
			}
		}
	}

  async changeImageFromCamera() {
		const image = await Camera.getPhoto({
			quality: 90,
			allowEditing: true,
      direction: CameraDirection.Front,
			resultType: CameraResultType.Base64,
			source: CameraSource.Camera // Camera, Photos or Prompt!
		});

		if (image) {
			const loading = await this.loadingController.create();
			await loading.present();

			const result = await this.profilService.uploadImage(image);
			loading.dismiss();

			if (!result) {
				const alert = await this.alertController.create({
					header: 'Upload failed',
					message: 'There was a problem uploading your avatar.',
					buttons: ['OK']
				});
				await alert.present();
			}
		}
	}

  async changeImageFromPrompt() {
		const image = await Camera.getPhoto({
			quality: 90,
			allowEditing: true,
      direction: CameraDirection.Front,
			resultType: CameraResultType.Base64,
			source: CameraSource.Prompt,// Camera, Photos or Prompt!
      promptLabelPhoto:'Choisir depuis la gallerie',
      promptLabelPicture: 'Prendre une photo',
		});

		if (image) {
			const loading = await this.loadingController.create();
			await loading.present();

			const result = await this.profilService.uploadImage(image);
			loading.dismiss();

			if (!result) {
				const alert = await this.alertController.create({
					header: 'Upload failed',
					message: 'There was a problem uploading your avatar.',
					buttons: ['OK']
				});
				await alert.present();
			}
		}
	}

  //content
  getBorderColor(etat: number): string {
    switch (etat) {
      case 0:
        return 'green';
      case 1:
        return 'orange';  
      case 2:
        return 'red';
      default:
        return 'grey'; // Couleur par défaut
    }
  }
  async presentPopover(ev: any, contact: any) {
    const popover = await this.popoverController.create({
      component: BullepopoverComponent,
      event: ev,
      translucent: true,
      componentProps: { contact: contact },
      showBackdrop: false, 
    });
    return await popover.present();
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

  //footer
  openGamificationPage() {
    this.navCtrl.navigateRoot('/gamificationhub', { animated: false });
  }
  openSettingsPage() {
    this.navCtrl.navigateRoot('/settings', { animated: false });
  }
}
