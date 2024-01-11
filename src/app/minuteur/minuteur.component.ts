import { Component, OnInit, OnDestroy } from '@angular/core';
import { LoadingController, ToastController } from '@ionic/angular';
import { ProfilService } from '../services/profil.service';
import { NgStyle, NgIf } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { LocalNotifications } from '@capacitor/local-notifications';

@Component({
  selector: 'app-minuteur',
  templateUrl: './minuteur.component.html',
  styleUrls: ['./minuteur.component.scss'],
  standalone: true,
  imports: [NgStyle, NgIf, IonicModule]
})
export class MinuteurComponent implements OnInit, OnDestroy {
  monProfil: any;
  tempsRestant: number = 0; // Durée initiale en secondes
  intervalId: any;
  progress = 1;

  constructor(
    private profilService: ProfilService,
    private loadingController: LoadingController,
    private toastController: ToastController,
  ) { }

  async ngOnInit() {
    const loading = await this.loadingController.create({
      message: 'Chargement...',
      spinner: 'circles'
    });
    await loading.present();

    this.profilService.getMonProfil().subscribe(async profil => {
      this.monProfil = profil;
      this.startTimer();
      await loading.dismiss();
    }, async error => {
      console.error('Erreur lors de la récupération du profil:', error);
      await loading.dismiss();
    });
    const perm = await LocalNotifications.requestPermissions();
  if (perm.display === 'granted') {
    // L'utilisateur a accepté les notifications
  }
  }
  

  formatTime(tempsEnSecondes: number): string {
    const heures = Math.floor(tempsEnSecondes / 3600);
    const minutes = Math.floor((tempsEnSecondes % 3600) / 60);
    const secondes = tempsEnSecondes % 60;

    const heuresFormattees = heures.toString().padStart(1, '0');
    const minutesFormattees = minutes.toString().padStart(2, '0');
    const secondesFormattees = secondes.toString().padStart(2, '0');

    return `${heuresFormattees}:${minutesFormattees}:${secondesFormattees}`;
  }

  startTimer() {
    const initialTime = 10;
    this.tempsRestant = initialTime;
    this.progress = 1;
  
    if (this.intervalId) {
      clearInterval(this.intervalId); // Arrêtez l'intervalle existant si nécessaire
    }
  
    this.intervalId = setInterval(() => {
      if (this.tempsRestant > 0) {
        this.tempsRestant--;
        this.progress = this.tempsRestant / initialTime;
      } else {
        this.handleTimerEnd();
      }
    }, 1000);
  }

  async handleTimerEnd() {
    clearInterval(this.intervalId);
    if (this.monProfil.etat > 0) {
      try {
        const newEtat = this.monProfil.etat - 1;
        await this.profilService.updateEtat(newEtat);
  
        if (this.monProfil.etat === 0) {
          // L'état est maintenant à 0, afficher le toast de félicitations
          await this.presentToastForEtatZero();
          await LocalNotifications.schedule({
            notifications: [
              {
                title: "Taux d'alcoolémie",
                body: "Super ! Vous devriez être dans le vert",
                id: 1,
                schedule: { at: new Date(Date.now() + 6000) },
                sound: "beep.wav", // Dans 1 seconde
                smallIcon: "path/to/smallIcon.png", // Optionnel, spécifiez le chemin vers une petite icône
                // Autres paramètres de notification peuvent être spécifiés ici
              },
            ],
          });
        } else {
          // Si l'état n'est pas 0, redémarrer le minuteur
          this.startTimer();
        }
      } catch (error) {
        console.error("Erreur lors de la mise à jour de l'état", error);
      }
    }
  }

  
  async presentToastForEtatZero() {
    const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const toastThemeClass = isDarkMode ? 'toast-light-theme' : 'toast-dark-theme';

    const toast = await this.toastController.create({
      header: 'Dans le vert !',
      message: 'Super, vous devriez pouvoir reprendre la route en toute sécurité',
      position: 'top',
      duration: 5000,
      cssClass: toastThemeClass,
    });
    toast.present();
  }

  ngOnDestroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

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

  getProgressColor(etat: number): string {
    switch (etat) {
      case 0:
        return 'success';
      case 1:
        return 'warning';  
      case 2:
        return 'danger';
      default:
        return 'grey'; // Couleur par défaut
    }
  }
  
}
