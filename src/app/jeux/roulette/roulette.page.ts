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

  public segments: Segment[] = []; // Tableau pour stocker les segments ajoutés à la roulette
  public degree = 0; // Angle de rotation actuel de la roulette
  public availableColors = ['Red', 'Blue', 'Green', 'Yellow', 'Purple', 'Orange', 'Fuchsia', 'Pink', 'Maroon', 'Coral', 'Aqua', 'Gold']; // Couleurs disponibles pour les segments
  public selectableColors = [...this.availableColors]; // Couleurs actuellement sélectionnables (copie de availableColors)
  public showTable = false; // Indicateur pour afficher ou masquer le tableau des segments
  public availableNames = ['Imad', 'MohamedAmine', 'Elie', 'Bilal', 'Arthur', 'Jami', 'MrG', 'MrC', 'MrGo']; // Liste des noms disponibles
  public selectableNames = [...this.availableNames]; // Noms actuellement sélectionnables (copie de availableNames)

  toggleTable() {
    this.showTable = !this.showTable;
  }

  constructor(
    public alertController: AlertController,
    private navCtrl: NavController,) {}

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

  spinWheel() {
    const randomSpin = Math.floor(Math.random() * 360) + 1440; // 1440 est 4 tours complets
    this.degree += randomSpin;
    this.degree %= 360;

    // Attends la fin de l'animation
    setTimeout(() => {
      const winningSegment = this.determineWinner();
      this.showWinner(winningSegment.name); // Affiche nom du gagnant
    }, 4000); // Doit correspondre à la durée de l'animation CSS
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
          this.selectableColors = [...this.availableColors]; // Réinitialiser la liste des couleurs dispo
          this.selectableNames = [...this.availableNames]; // Réinitialiser la liste des noms dispo
          this.availableColors = ['Red', 'Blue', 'Green', 'Yellow', 'Purple', 'Orange', 'Fuchsia', 'Pink', 'Maroon', 'Coral', 'Aqua', 'Gold'];
        }
      }]
    });

    await alert.present();
  }

//nav footer
openGamificationPage() {
  this.navCtrl.navigateRoot('/gamificationhub', { animated: false });
}

goHome() {
  this.navCtrl.navigateRoot('/home', { animated: false });
}
}