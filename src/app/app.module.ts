import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';


@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    IonicModule.forRoot({ }), 
    AppRoutingModule, provideFirebaseApp(() => initializeApp({"projectId":"drink-3257c","appId":"1:842819833817:web:fcacf2ea63c614a5d593c8","storageBucket":"drink-3257c.appspot.com","apiKey":"AIzaSyDmbOfzRxisx3P-E8O96UmxNZjRHt0ik0Y","authDomain":"drink-3257c.firebaseapp.com","messagingSenderId":"842819833817"})), provideFirestore(() => getFirestore())],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],
  bootstrap: [AppComponent],
})
export class AppModule {}
