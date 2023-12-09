// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.
import { firebaseConfig } from './firebase.config';

export const environment = {
  production: false,
  firebaseConfig: {
    apiKey: "AIzaSyDmbOfzRxisx3P-E8O96UmxNZjRHt0ik0Y",
    authDomain: "drink-3257c.firebaseapp.com",
    projectId: "drink-3257c",
    storageBucket: "drink-3257c.appspot.com",
    messagingSenderId: "842819833817",
    appId: "1:842819833817:web:fcacf2ea63c614a5d593c8"
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
