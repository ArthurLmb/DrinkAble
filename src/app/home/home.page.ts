import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { PopoverController } from '@ionic/angular';
import { BullepopoverComponent } from '../bullepopover/bullepopover.component';
import { ContactService } from '../services/contact.service';
import { ProfilService } from '../services/profil.service';
import { NavController } from '@ionic/angular';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  contacts: any[] = [];
  monprofil: any;
  popoverEvent: any;
  currentFilter: string = 'all'; // 'all' ou 'favorites'
  newLocalisation: string = '';

  constructor(
    private router: Router,
    private navCtrl: NavController,
    private contactService: ContactService,
    private profilService: ProfilService,
    private popoverController: PopoverController,
    private modalController: ModalController
    
    ) {}
    ngOnInit() {
      this.loadAllContacts();
      this.profilService.getMonProfil().subscribe(profil => {
        this.monprofil = profil;
        this.newLocalisation = this.monprofil?.localisation || '';
      });
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

  async onUpdateLocalisation() {
    try {
      await this.profilService.updateLocalisation(this.newLocalisation);
      // Réinitialisez le champ d'entrée ou effectuez d'autres actions nécessaires.
      this.newLocalisation = '';
      this.modalController.dismiss();
    } catch (error) {
      // Gérez les erreurs ici, par exemple, affichez un message d'erreur à l'utilisateur.
    }
  }

  async dismissModal() {
    await this.modalController.dismiss();
  }


  //content
  getBorderColor(etat: string): string {
    switch (etat) {
      case 'vert':
        return 'green';
      case 'orange':
        return 'orange';
      case 'rouge':
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

  //footer
  openGamificationPage() {
    this.navCtrl.navigateRoot('/reactivity-game', { animated: false });
  }
}
