import { Component, OnInit, OnDestroy } from '@angular/core';
import { LoadingController, ToastController, AlertController } from '@ionic/angular';
import { ProfilService } from '../services/profil.service';
import { NgStyle, NgIf } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { LocalNotifications } from '@capacitor/local-notifications';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-minuteur',
  templateUrl: './minuteur.component.html',
  styleUrls: ['./minuteur.component.scss'],
  standalone: true,
  imports: [NgStyle, NgIf, IonicModule]
})
export class MinuteurComponent implements OnInit, OnDestroy {
  monProfil: any;
  tempsTotal: number = 0;
  tempsRestant: number = 0; // Durée initiale en secondes
  intervalId: any;
  progress = 1;
  oldConsoValue: number = 0;
  private bacCumulatif: number = 0;


  constructor(
    private profilService: ProfilService,
    private loadingController: LoadingController,
    private toastController: ToastController,
    private alertController: AlertController,
    private navCtrl: NavController,
  ) { }

  async ngOnInit() {
    const loading = await this.loadingController.create({
      message: 'Chargement...',
      spinner: 'circles'
    });
    await loading.present();
  
    // Souscription à getMonProfil
    this.profilService.getMonProfil().subscribe(async profil => {
      // Mise à jour du profil
      if (this.monProfil && profil.conso > this.monProfil.conso) {
        // Si 'conso' a augmenté, maj de l'état et du minuteur
        this.addDrink();
      }
  
      this.monProfil = profil; // Mettez à jour le profil actuel avec les nouvelles données
  
      
      // Initialisation ou réinitialisation du minuteur
      //if (!this.intervalId) {
      // this.startTimer();
      //  }
  
      await loading.dismiss();
    }, async error => {
      console.error('Erreur lors de la récupération du profil:', error);
      this.navCtrl.navigateRoot('/home', { animated: false });
      await loading.dismiss();
    });

    const loadingg = await this.loadingController.create({
      message: 'Chargement...',
      spinner: 'circles'
    });
    await loadingg.present();
    await this.verifyAndUpdateIfNeeded();
    // Récupération du BAC cumulatif de Firestore
    this.bacCumulatif = await this.profilService.getBACCumulatif();
    await loadingg.dismiss();
  

  
    // Gestion des permissions pour les notifications locales
    const perm = await LocalNotifications.requestPermissions();
    if (perm.display === 'granted') {
      // L'utilisateur a accepté les notifications
    }
  }

  async verifyAndUpdateIfNeeded() {
    const loading = await this.loadingController.create({
      message: 'Chargement du minuteur...',
      spinner: 'circles'
    });
    await loading.present();

    try {
      console.log("Récupération des données du minuteur");
      const timerData = await this.profilService.getTimerData();
      console.log("Données du minuteur récupérées :", timerData);
      const currentTime = Date.now();
      const elapsed = Math.round((currentTime - timerData.timestamp) / 1000);

      if (!this.monProfil) {
        console.log("Profil non chargé, tentative de rechargement...");
        this.monProfil = await this.profilService.getMonProfil(); // Recharger le profil
      }

      if (timerData.tempsRestant <= 0 && this.monProfil && this.monProfil.etat > 0) {
        // Vérifiez si l'état ou la consommation doivent être mis à jour
        if (this.monProfil.etat !== 0 || this.monProfil.conso !== 0) {
          await Promise.all([
            this.profilService.updateConso(0),
            this.profilService.updateEtat(0)
          ]);
          console.log("État et consommation mis à jour à 0");
        }

        // Envoyer les notifications uniquement si l'état initial n'était pas à 0
        if (this.monProfil.etat !== 0) {
          console.log("Notifs send");
          await this.presentToastForEtatZero();
          await LocalNotifications.schedule({
              notifications: [
                  {
                      title: "Taux d'alcoolémie",
                      body: "Super ! Vous devriez être dans le vert",
                      id: 1,
                      schedule: { at: new Date(Date.now() + 6000) },
                      sound: "beep.wav",
                      smallIcon: "path/to/smallIcon.png",
                  },
              ],
          });
        }
      } else if (this.monProfil) {
        // Ajuster le tempsRestant si nécessaire
        this.tempsRestant = Math.max(timerData.tempsRestant - elapsed, 0);
        this.tempsTotal = Math.max(this.tempsRestant, this.tempsTotal);
        this.updateProgress();
        this.updateEtatBasedOnTime();
        if (this.tempsRestant > 0) {
          this.startTimer();
        }
      }
    } catch (error) {
      console.error("Erreur lors de la vérification des données du minuteur", error);
      this.navCtrl.navigateRoot('/home', { animated: false });
    } finally {
      await loading.dismiss();
    }
}

  
  
//mise en forme du timer basé sur les secondes
  formatTime(tempsEnSecondes: number): string {
    const heures = Math.floor(tempsEnSecondes / 3600);
    const minutes = Math.floor((tempsEnSecondes % 3600) / 60);
    const secondes = tempsEnSecondes % 60;

    const heuresFormattees = heures.toString().padStart(1, '0');
    const minutesFormattees = minutes.toString().padStart(2, '0');
    const secondesFormattees = secondes.toString().padStart(2, '0');

    return `${heuresFormattees}:${minutesFormattees}:${secondesFormattees}`;
  }

  //Calcul du minuteur en fonction du BAC
  addDrink() {
    // Assurez-vous que monProfil est initialisé et a les propriétés nécessaires
    if (!this.monProfil || this.monProfil.poids === undefined || this.monProfil.sexe === undefined) {
      console.error("Les informations de profil sont incomplètes pour calculer le temps d'élimination.");
      return;
    }

    const poidsEnGrammes = this.monProfil.poids * 1000; // Conversion du poids en kilogrammes en grammes
    const r = this.monProfil.sexe === 'homme' ? 0.68 : 0.55; // Facteur de distribution en fonction du sexe
    const alcoolGrammes = 10; // 10g pour un verre standard

    // Calcul du BAC en pourcentage
    const BAC = (alcoolGrammes / (poidsEnGrammes * r)) * 100;
    this.bacCumulatif += BAC;
   // Mettre à jour le BAC cumulatif sur Firestore
    this.profilService.updateBACCumulatif(this.bacCumulatif);
    console.log("BAC cumulatif :", this.bacCumulatif);
    

    // Taux d'élimination ajusté en g/100mL par heure
    const tauxEliminationAjuste = 0.020;

    // Calcul du temps d'élimination en heures en utilisant le taux d'élimination ajusté
    const tempsEliminationHeures = BAC / tauxEliminationAjuste;

    // Conversion du temps d'élimination en secondes pour le minuteur
    const tempsAjoute = Math.round(tempsEliminationHeures * 3600);

    // Mise à jour du temps restant et du temps total
    this.tempsRestant += tempsAjoute;
    this.tempsTotal = Math.max(this.tempsTotal, this.tempsRestant);

    // Mise à jour du progrès et de l'état
    this.updateProgress();
    this.updateEtatBasedOnTime();

     // Mettre à jour le BAC cumulatif et les données du minuteur sur Firestore
  try {
    this.profilService.updateBACCumulatif(this.bacCumulatif);
    this.profilService.updateTimerData(this.tempsRestant, Date.now());
  } catch (error) {
    console.error("Erreur lors de la mise à jour de BAC cumulatif et des données du minuteur", error);
  }

    // Redémarrer le minuteur si nécessaire
    if (!this.intervalId) {
      this.startTimer();
    }
}

//gère la bare de progression
  updateProgress() {
    if (this.tempsTotal > 0) {
        this.progress = this.tempsRestant / this.tempsTotal; // Calcul du progrès
    } else {
        this.progress = 1;
    }
  }

  //défini l'état en fonction de l'avancé du minuteur
  async updateEtatBasedOnTime() {
    let newEtat;
    if (this.tempsRestant <= 0) {
      newEtat = 0;
    } else {
      newEtat = (this.bacCumulatif < 0.05) ? 1 : 2;
    }

    if (newEtat !== this.monProfil.etat) {
      this.monProfil.etat = newEtat;
      try {
        await this.profilService.updateEtat(newEtat);
        
        // Appeler presentToastForEtatRed si l'état est mis à jour à 2
        if (newEtat === 2) {
          await this.presentToastForEtatRed();
      }
      } catch (error) {
        console.error("Erreur lors de la mise à jour de l'état dans Firestore", error);
      }
    }
  }

  //logique de diminution du temps
  startTimer() {
    let secondCounter = 0; // Compteur pour les secondes écoulées
  
    if (!this.intervalId) {
      this.intervalId = setInterval(async () => {
        if (this.tempsRestant > 0) {
          this.tempsRestant--;
          this.updateProgress();
          this.updateEtatBasedOnTime();
  
        } else {
          this.handleTimerEnd();
        }
      }, 1000);
    }
  }


  //logique de fin de timer
  async handleTimerEnd() {
    if (this.tempsRestant <= 0) {
      clearInterval(this.intervalId);
      this.intervalId = null;
      this.tempsRestant = 0;
      this.bacCumulatif = 0; // Réinitialiser le BAC cumulatif
  
      try {
        await Promise.all([
          this.profilService.updateConso(0), // Réinitialiser conso à 0 dans Firestore
          this.profilService.updateEtat(0), // Réinitialiser l'état à 0 dans Firestore
          this.profilService.updateTimerData(0, Date.now()), // Réinitialiser tempsRestant et timestamp à 0 dans Firestore
          this.profilService.updateBACCumulatif(0) // Réinitialiser le BAC cumulatif dans Firestore
        ]);
  
        console.log("Minuteur et données réinitialisés avec succès");
        await this.presentToastForEtatZero();
        await LocalNotifications.schedule({
            notifications: [
                {
                    title: "Taux d'alcoolémie",
                    body: "Super ! Vous devriez être dans le vert",
                    id: 1,
                    schedule: { at: new Date(Date.now() + 6000) },
                    sound: "beep.wav",
                    smallIcon: "path/to/smallIcon.png",
                },
            ],
        });
      } catch (error) {
        console.error("Erreur lors de la réinitialisation des données dans Firestore", error);
      }
    }
  }

  //Toast lorsque le user est à 0
  async presentToastForEtatZero() {
    const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const toastThemeClass = isDarkMode ? 'toast-light-theme' : 'toast-dark-theme';
    await this.profilService.updateEtat(0);

    const toast = await this.toastController.create({
      header: 'Dans le vert !',
      message: 'Super, vous devriez pouvoir reprendre la route en toute sécurité',
      position: 'top',
      duration: 5000,
      cssClass: toastThemeClass,
    });
    toast.present();
  }

  //Toast lorsque le user dépasse le seuil rouge
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

  async ngOnDestroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  //message alerte confirmation
  async reinitialiserMinuteur() {
    const alert = await this.alertController.create({
      header: 'Confirmez',
      message: 'Êtes-vous sûr de vouloir réinitialiser le minuteur ?',
      buttons: [
        {
          text: 'Annuler',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Réinitialisation annulée');
          }
        }, {
          text: 'Confirmer',
          cssClass: 'danger',
          handler: async () => {
            console.log('Réinitialisation confirmée');
            await this.resetMinuteur();
          }
        }
      ]
    });
  
    await alert.present();
  }
  
  //logique de reset
  async resetMinuteur() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.progress = 1;
    
    const loading = await this.loadingController.create({
      message: 'Chargement...',
      spinner: 'circles'
    });
    await loading.present();
  
    try {
      await Promise.all([
      this.profilService.updateBACCumulatif(this.bacCumulatif),
      this.profilService.updateConso(0),
      this.profilService.updateEtat(0),
      this.profilService.updateTimerData(0, Date.now()),
    ]);
      console.log("Minuteur réinitialisé et données mises à jour dans Firestore");
    } catch (error) {
      console.error("Erreur lors de la réinitialisation des données", error);
    } finally {
      await loading.dismiss();
    }
  }
  

  //traduit l'état en couleur pour l'ui
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

  //Change la couleur de la bare de progression en fonction  de l'état
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
