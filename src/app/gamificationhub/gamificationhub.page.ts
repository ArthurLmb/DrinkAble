import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-gamificationhub',
  templateUrl: './gamificationhub.page.html',
  styleUrls: ['./gamificationhub.page.scss'],
})
export class GamificationhubPage implements OnInit {

  constructor(
    private navCtrl: NavController,
  ) { }

  ngOnInit() {
  }

  goHome() {
    this.navCtrl.navigateRoot('/home', { animated: false });
  }
  
  openJeuReactivite() {
    this.navCtrl.navigateRoot('/reactivity-game', { animated: false });
  }

  openJeuRoulette() {
    this.navCtrl.navigateRoot('/roulette', { animated: false });
  }

  openGamificationPage() {
    this.navCtrl.navigateRoot('/gamificationhub', { animated: false });
  }
}
