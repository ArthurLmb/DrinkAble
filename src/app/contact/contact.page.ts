import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { ContactService } from '../services/contact.service';
import { Share } from '@capacitor/share';
import { PopoverController, LoadingController} from '@ionic/angular';
import { ContactPopoverComponent } from '../contact-popover/contact-popover.component';
import { Keyboard } from '@capacitor/keyboard';
import { PluginListenerHandle } from '@capacitor/core';
import { NavController } from '@ionic/angular';
import { ProfilService } from '../services/profil.service';



@Component({
  selector: 'app-contact',
  templateUrl: 'contact.page.html',
  styleUrls: ['contact.page.scss'],
})
export class ContactPage implements OnInit, OnDestroy {
  monprofil: any;
  favorisContacts?: Observable<any[]>;
  autresContacts?: Observable<any[]>;
  filteredContacts: any[] = [];
  searchTerm: string = '';
  isSortedByNom: boolean = true; // true si trié par nom, false si trié par lieu  
  isKeyboardVisible: boolean = false;
  private keyboardSubscriptions: PluginListenerHandle[] = [];


  constructor(
    private navCtrl: NavController,
    private contactService: ContactService,
    private profilService: ProfilService,
    private popoverController: PopoverController,
    private loadingController: LoadingController,
  ) {}
  monProfil: any;

  async ngOnInit() {
    const loading = await this.loadingController.create({
      message: 'Chargement...',
      spinner: 'circles'
    });
    await loading.present();

    this.loadUserProfile();
    this.profilService.getMonProfil().subscribe(profil => {
      this.monprofil = profil;
    }, error => {
      console.error('Erreur lors de la récupération du profil:', error);
      this.loadUserProfile();
    });
    this.sortContacts();
    this.setupKeyboardListeners();
    await loading.dismiss();
  }

  loadUserProfile() {
    this.profilService.getMonProfil().subscribe(data => {
      this.monProfil = data;
    }, error => {
      console.error('Erreur lors de la récupération du profil:', error);
    });
  }

  //ecoute si le keybord est activé pour supprimé le footer car bug
  private async setupKeyboardListeners() {
    const showListener = await Keyboard.addListener('keyboardWillShow', () => {
      this.isKeyboardVisible = true;
    });
    const hideListener = await Keyboard.addListener('keyboardWillHide', () => {
      this.isKeyboardVisible = false;
    });

    this.keyboardSubscriptions.push(showListener, hideListener);
  }

  ngOnDestroy() {
    this.keyboardSubscriptions.forEach(listenerHandle => listenerHandle.remove());
  }

  toggleSort() {
    this.isSortedByNom = !this.isSortedByNom;
    this.sortContacts();
  }

  async shareInvit() {
    await Share.share({
      title: "Inviter un ami sur Drink'Able!",
      text: `Rejoins moi dès maintenant sur l'application Drink'Able! Ton compagnon pour des sorties plus sûres.`,//a modifier
      url: 'https://lelienpourtelecharcherlappli.com', // Si vous souhaitez ajouter un lien vers votre jeu ou site web
      dialogTitle: 'Inviter un ami',
    })

}

  sortContacts() {
    this.contactService.getContacts().pipe(
      map(contacts => contacts.sort((a, b) => 
        this.isSortedByNom ? a.nom.localeCompare(b.nom) : a.localisation.localeCompare(b.localisation)
      )),
      map(contacts => ({
        favoris: of(contacts.filter(contact => contact.favoris)),
        autres: of(contacts.filter(contact => !contact.favoris))
      }))
    ).subscribe(sorted => {
      this.favorisContacts = sorted.favoris;
      this.autresContacts = sorted.autres;
    });
  }

  getEtatColor(etat: number): string {
  switch (etat) {
    case 0:
      return 'green';
    case 1:
      return 'orange';
    case 2:
      return 'red';
    default:
      return 'grey'; // Une couleur par défaut si l'état est inconnu
  }
}


filterContacts(event: any) {
  this.searchTerm = event.detail.value.toLowerCase();

  if (!this.searchTerm) {
    this.filteredContacts = [];
    return;
  }
  this.contactService.getContacts().subscribe(contacts => {
    this.filteredContacts = contacts.filter(contact =>
      (contact.nom.toLowerCase().includes(this.searchTerm) ||
      contact.localisation.toLowerCase().includes(this.searchTerm))
    );
});
}

  async presentPopover(ev: any, contact: any) {
    const popover = await this.popoverController.create({
      component: ContactPopoverComponent,
      event: ev,
      translucent: true,
      componentProps: { contact: contact },
      showBackdrop: false
    });
    return await popover.present();
  }
  

//footer
  goHome() {
    this.navCtrl.navigateRoot('/home', { animated: false });
  }
  
  openGamificationPage() {
    this.navCtrl.navigateRoot('/gamificationhub', { animated: false });
  }

  openSettingsPage() {
    this.navCtrl.navigateRoot('/settings', { animated: false });
  }
}

