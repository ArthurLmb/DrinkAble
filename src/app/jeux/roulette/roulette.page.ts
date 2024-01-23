import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { NavController } from '@ionic/angular';

interface Segment {
  color: string;
  name: string;
}

@Component({
  selector: 'app-roulette',
  templateUrl: './roulette.page.html',
  styleUrls: ['./roulette.page.scss'],
})
export class RoulettePage {

  // Déclaration des propriétés utilisées dans le composant
  public segments: Segment[] = []; // Tableau pour stocker les segments ajoutés à la roulette
  public degree = 0; // Angle de rotation actuel de la roulette
  public availableColors = ['Red', 'Blue', 'Green', 'Yellow', 'Purple', 'Orange', 'Fuchsia', 'Pink', 'Maroon', 'Coral', 'Aqua', 'Gold']; // Couleurs disponibles pour les segments
  public selectableColors = [...this.availableColors]; // Couleurs actuellement sélectionnables (copie de availableColors)
  public showTable = false; // Indicateur pour afficher ou masquer le tableau des segments
  public availableNames = ['Imad', 'MohamedAmine', 'Elie', 'Bilal', 'Arthur', 'Jami', 'MrG', 'MrC', 'MrGo']; // Liste des noms disponibles
  public selectableNames = [...this.availableNames]; // Noms actuellement sélectionnables (copie de availableNames)
  showContactOptions = false;
  public winningColor = '';
  public spinwheel = false ;

  
  toggleTable() {
    this.showTable = !this.showTable;
    this.showContactOptions = false;
    this.spinwheel = false ;
  }
  toggleContactOptions() {
    this.showContactOptions = !this.showContactOptions;
    this.showTable = false; 
    this.spinwheel = false ;
  }

  constructor(
    public alertController: AlertController,
    private navCtrl: NavController) {}

 // Ajoute un nouveau nom à la liste des segments et réinitialise le champ de saisie
 addNewName(newNameInput: HTMLInputElement) {
  const newName = newNameInput.value;
  if (newName && !this.availableNames.includes(newName)) {
    this.availableNames.push(newName);
    this.selectableNames.push(newName);
    this.addSegment(newName); // Appelle addSegment pour ajouter un segment
    newNameInput.value = ''; // Réinitialise le champ de saisie
  }
}
  

 // Ajoute un segment avec le nom sélectionné et une couleur aléatoire
 addSegment(selectedName: string) {
  if (!selectedName) {
    console.error('Veuillez fournir un nom.');
    return;
  }

     // Retire le nom de la liste des noms sélectionnables
     this.selectableNames = this.selectableNames.filter(name => name !== selectedName);

     // Vérifie s'il reste des couleurs disponibles
     if (this.availableColors.length === 0) {
       console.error('Plus de couleurs disponibles.');
       return;
     }


    // Choisis une couleur aléatoirement et la retire de la liste des couleurs disponibles
    const randomIndex = Math.floor(Math.random() * this.availableColors.length);
    const selectedColor = this.availableColors[randomIndex];
    this.availableColors.splice(randomIndex, 1);


    // Ajoute le segment à la roulette
    this.segments.push({ name: selectedName, color: selectedColor });
  }

  resetWheel() {
    this.degree = 0;
    this.winningColor = ''; // Réinitialise la couleur du segment gagnant
    // Autres réinitialisations si nécessaire
  }

spinWheel() {
   // Vérifier si il y a au moins un segment avant de lancer la roue
   if (this.segments.length === 0) {
    console.error('Ajoutez au moins un segment avant de lancer la roue.');
    // Vous pouvez également utiliser une alerte Ionic ici pour informer l'utilisateur
    return; // Quitte la méthode si aucun segment n'est présent
  }
  this.showTable = false; 
  this.showContactOptions = false;

  this.resetWheel(); // Assurez-vous que la roulette est réinitialisée avant de lancer

    const randomSpin = Math.floor(Math.random() * 360) + 20000; // 3600 est 10 tours complets
    this.degree += randomSpin;

    // Attends la fin de l'animation
    setTimeout(() => {
      const winningSegment = this.determineWinner();
      this.winningColor = winningSegment.color; // Met à jour la couleur gagnante
      this.showWinner(winningSegment.name); // Affiche nom du gagnant
      this.availableColors = ['Red', 'Blue', 'Green', 'Yellow', 'Purple', 'Orange', 'Fuchsia', 'Pink', 'Maroon', 'Coral', 'Aqua', 'Gold'];
      this.selectableColors = [...this.availableColors];
      this.selectableNames = [...this.availableNames];
      this.resetRouletteState();
    }, 5000); // Doit correspondre à la durée de l'animation CSS
  }

// Détermine le segment gagnant en fonction de l'angle de rotation
  determineWinner(): Segment {
    const degreesPerSegment = 360 / this.segments.length;
    const winningIndex = Math.floor((this.degree % 360) / degreesPerSegment);
    return this.segments[winningIndex]; // Retourne le segment gagnant
  }

  async showWinner(winnerName: string) {
    const alert = await this.alertController.create({
      header: 'Le bob de la soirée est',
      message: `${winnerName} :) !`,
      buttons: [{
        text: 'OK',
        handler: () => {
          this.degree = 0; // Réinitialiser l'angle de la roulette
          this.segments = []; // Vider la roulette de ses segments
          this.resetWheel(); // Assurez-vous que ceci est appelé correctement
          this.resetRouletteState();
        }
      }]
    });

    await alert.present();
  }
  resetRouletteState() {
    // 1. Réinitialisation de l'angle de rotation
    this.degree = 0;
    // Cette ligne réinitialise la variable 'degree' à 0. 
    // 'degree' est utilisée pour déterminer l'angle de rotation de la roulette. 
    // En le réglant à 0, la roulette est remise à sa position de départ.
  
    // 2. Sélection de l'élément de la roulette
    const rouletteElement = document.querySelector('.roulette') as HTMLElement;
    // Ici, on sélectionne l'élément DOM de la roulette en utilisant 'document.querySelector'.
    // 'as HTMLElement' est une assertion de type pour s'assurer que 'rouletteElement' est traité comme un élément HTML.
  
    // 3. Désactivation temporaire de l'animation de transition
    rouletteElement.style.transition = 'none';
    // Cette ligne désactive temporairement les animations de transition sur 'rouletteElement'.
    // En définissant la propriété 'transition' sur 'none', les modifications apportées à 'transform' ci-dessous se produiront instantanément, sans animation.
  
    // 4. Réinitialisation de la transformation de rotation
    rouletteElement.style.transform = 'rotate(0deg)';
    // Cette ligne réinitialise la propriété 'transform' de 'rouletteElement', la faisant tourner de 0 degré.
    // Cela ramène visuellement la roulette à sa position de départ sans aucune animation.
  
    // 5. Réactivation de l'animation de transition
    setTimeout(() => rouletteElement.style.transition = '', 50);
    // Enfin, un 'setTimeout' est utilisé pour retarder la réactivation de l'animation de transition.
    // Après un délai de 50 millisecondes, la propriété 'transition' est réinitialisée à sa valeur par défaut, permettant à de futures animations de se produire normalement.
  }
  removeSegment(segmentName: string) {
    this.segments = this.segments.filter(segment => segment.name !== segmentName);
    // Ajoutez ici toute autre logique nécessaire après la suppression d'un segment
  }

//nav footer
openGamificationPage() {
  this.navCtrl.navigateRoot('/gamificationhub', { animated: false });
}

goHome() {
  this.navCtrl.navigateRoot('/home', { animated: false });
}

openSettingsPage() {
  this.navCtrl.navigateRoot('/settings', { animated: false });
}
}