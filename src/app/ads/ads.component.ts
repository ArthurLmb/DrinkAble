import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, Component, Input, OnInit } from '@angular/core';
import { IonicSlides } from '@ionic/angular';

@Component({
  selector: 'app-ads',
  templateUrl: './ads.component.html',
  styleUrls: ['./ads.component.scss'],
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [CommonModule]
})
export class AdsComponent  implements OnInit {

  @Input() slides: any [] = [];

  swiperModules = [IonicSlides];

  constructor() { }

  ngOnInit() {}

}
