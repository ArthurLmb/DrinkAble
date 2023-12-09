import { Component, OnInit, OnDestroy } from '@angular/core';
import { LoadingController, ToastController } from '@ionic/angular';
import { ProfilService } from '../services/profil.service';
import { NgStyle, NgIf } from '@angular/common';

@Component({
  selector: 'app-minuteur',
  templateUrl: './minuteur.component.html',
  styleUrls: ['./minuteur.component.scss'],
  standalone: true,
  imports: [NgStyle, NgIf]
})
export class MinuteurComponent implements OnInit, OnDestroy {
  monProfil: any;
  tempsRestant: number = 0; // Durée initiale en secondes
  intervalId: any;

  constructor(
    private profilService: ProfilService,
    private loadingController: LoadingController,
    private toastController: ToastController
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
  }

  startTimer() {
    if (this.intervalId) {
      clearInterval(this.intervalId); // Arrêtez l'intervalle existant si nécessaire
      this.tempsRestant = 4; // Réinitialiser le temps restant
    }
    this.intervalId = setInterval(() => {
      if (this.tempsRestant > 0) {
        this.tempsRestant--;
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
        this.monProfil.etat = newEtat;
  
        if (this.monProfil.etat === 0) {
          // L'état est maintenant à 0, afficher le toast de félicitations
          await this.presentToastForEtatZero();
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
      message: 'Super, vous devriez pouvoir reprendre la route en toute sécurité.',
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
}
