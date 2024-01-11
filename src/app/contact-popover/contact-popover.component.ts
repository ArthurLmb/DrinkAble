import { Component, Input } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { ContactService } from '../services/contact.service'; // Assure-toi que ce chemin est correct
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-contact-popover',
  templateUrl: './contact-popover.component.html',
  styleUrls: ['./contact-popover.component.scss'], // Si tu as un fichier de style
})
export class ContactPopoverComponent {
  @Input() contact: any; // Remplace 'any' par le type approprié de tes contacts

  constructor(
    private popoverController: PopoverController,
    private contactService: ContactService, // Si tu as besoin de services pour gérer les contacts
    private alertController: AlertController
  ) {}

  get estFavori() {
    return this.contact?.favoris;
  }

  toggleFavoris() {
    this.contactService.toggleFavoris(this.contact.id, this.contact.favoris).then(() => {
      this.popoverController.dismiss();
    });
  }

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
  async supprimerContact() {
    const alert = await this.alertController.create({
      header: 'Confirmer la Suppression',
      message: 'Voulez-vous vraiment supprimer ce contact ?',
      buttons: [
        {
          text: 'Annuler',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Suppression annulée');
          }
        }, {
          text: 'Confirmer',
          handler: () => {
            this.contactService.deleteContact(this.contact.id).then(() => {
              console.log('Contact supprimé');
              this.popoverController.dismiss();
            });
          }
        }
      ]
    });
  
    await alert.present();
  }
}
