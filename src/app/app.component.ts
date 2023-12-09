import { CUSTOM_ELEMENTS_SCHEMA, Component, OnInit } from '@angular/core';
import { Keyboard } from '@capacitor/keyboard';
import { register } from 'swiper/element/bundle';

register();

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  isKeyboardVisible: boolean = false;

  constructor() {}

  ngOnInit() {
    Keyboard.addListener('keyboardWillShow', info => {
      this.isKeyboardVisible = true;
    });

    Keyboard.addListener('keyboardWillHide', () => {
      this.isKeyboardVisible = false;
    });
  }
}
