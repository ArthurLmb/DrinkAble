import { Component } from '@angular/core';
import { Share } from '@capacitor/share';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-reactivity-game',
  templateUrl: './reactivity-game.page.html',
  styleUrls: ['./reactivity-game.page.scss'],
})
export class ReactivityGamePage {
  score = 0;
  timeLeft = 5;
  gameStarted = false;
  timer: any;
  currentIcon: string = "";
  iconPosition = { top: '50%', left: '50%' };

  icons = ['medkit', 'beer', 'wine', 'speedometer', 'car' ]; // Remplacez par les noms de vos icônes

  showResults = false;

  constructor(
    private navCtrl: NavController,
    ) {}

  goHome() {
    this.navCtrl.navigateRoot('/home', { animated: false });
    clearInterval(this.timer);
    this.gameStarted = false;
    this.showResults = false;
  }

  ngOnInit() {}

  startGame() {
    this.gameStarted = true;
    this.showResults = false;
    this.score = 0;
    this.timeLeft = 5;
    this.nextIcon();
    this.timer = setInterval(() => this.tick(), 1000);
  }

  tick() {
    if (this.timeLeft > 0) {
      this.timeLeft--;
    } else {
      this.endGame();
    }
  }

  nextIcon() {
    const randomIndex = Math.floor(Math.random() * this.icons.length);
    this.currentIcon = this.icons[randomIndex];
    this.setIconRandomPosition();
  }

  setIconRandomPosition() {
    const gameArea = document.querySelector('.game-area');
    if (gameArea) {
      const maxHeight = gameArea.clientHeight - 100; // 100px est la taille de l'icône
      const maxWidth = gameArea.clientWidth - 100;
      this.iconPosition = {
        top: Math.floor(Math.random() * maxHeight) + 'px',
        left: Math.floor(Math.random() * maxWidth) + 'px',
      };
    }
  }

  iconClicked() {
    if (this.gameStarted) {
      this.score++;
      this.nextIcon(); // Préparez la prochaine icône
    }
  }

  endGame() {
    clearInterval(this.timer);
    this.gameStarted = false;
    this.showResults = true;
  }

  restartGame() {
    this.startGame(); // Vous pouvez réutiliser la méthode startGame pour redémarrer
  }

  async shareScore() {
    await Share.share({
      title: 'Mon score au jeu de réactivité',
      text: `J'ai obtenu un score de ${this.score} au jeu de réactivité de Drink'Able! Rejoins moi dès maintenant sur l'application !`,//a modifier
      url: 'https://lelienpourtelecharcherlappli.com', // Si vous souhaitez ajouter un lien vers votre jeu ou site web
      dialogTitle: 'Partager votre score',
    })

}}
