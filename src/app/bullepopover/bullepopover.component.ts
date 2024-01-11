import { Component, Input } from '@angular/core';
import { PopoverController, AlertController } from '@ionic/angular';
import { ContactService } from '../services/contact.service';

@Component({
  selector: 'app-bullepopover',
  templateUrl: './bullepopover.component.html',
  styleUrls: ['./bullepopover.component.scss'],
})
export class BullepopoverComponent {
  @Input() contact: any;
  
  constructor(
    private popoverController: PopoverController,
    private alertController: AlertController,
    private contactService: ContactService,
  ) { }

  appelerContact() {
    window.location.href = `tel:${this.contact.numTel}`;
    this.popoverController.dismiss();
  }

  messageContact() {
    window.location.href = `sms:${this.contact.numTel}`;
    this.popoverController.dismiss();
  }
  async ouvrirOptionsCartographie() {
    const alert = await this.alertController.create({
      header: "Choisir une application",
      buttons: [
        {
          text: 'Google Maps',
          handler: () => {
            this.ouvrirAdresseSurCarte('google');
          }
        },
        {
          text: 'Apple Plans',
          handler: () => {
            this.ouvrirAdresseSurCarte('apple');
          }
        },
        {
          text: 'Waze',
          handler: () => {
            this.ouvrirAdresseSurCarte('waze');
          }
        },
        {
          text: 'Annuler',
          role: 'cancel',
          cssClass: 'secondary'
        }
      ]
    });

    await alert.present();
  }
  ouvrirAdresseSurCarte(type: string) {
    let url: string = ''; // Initialisez la variable 'url' avec une chaîne vide
    const adresseEncodee = encodeURI(this.contact.localisation);
  
    // Définissez 'url' en fonction du type de cartographie choisi
    if (type === 'google') {
      url = `https://www.google.com/maps/search/?api=1&query=${adresseEncodee}`;
    } else if (type === 'apple') {
      url = `maps://maps.apple.com/?q=${adresseEncodee}`;
    } else if (type === 'waze') {
      url = `https://waze.com/ul?q=${adresseEncodee}`;
    }
  
    // Vérifiez si 'url' a été défini avant de l'ouvrir
    if (url) {
      window.open(url, '_system');
    } else {
      console.error('Type de cartographie non pris en charge ou adresse manquante');
    }
  
    this.popoverController.dismiss();
  }
}
