// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

/**
 * La variable firebaseConfig la podemos obtener despues de crear un proyecto web
 * en firebase, desde la parte de "Settings" de la cuenta de firebase podemos acceder
 * a nuestros proyectos, y en el web se encuentra esta variable en "Firebase SDK snippet".
 * Gracias a esta variable podemos acceder a todas las funcionalidades web que ofrece
 * firebase.
 */
export const environment = {
  production: false,
  firebaseConfig: {
    apiKey: 'AIzaSyD6IT-L8edKayrTkhTmFoNPNMgknoXWk3g',
    authDomain: 'boilerplate-fire.firebaseapp.com',
    databaseURL: 'https://boilerplate-fire.firebaseio.com',
    projectId: 'boilerplate-fire',
    storageBucket: 'boilerplate-fire.appspot.com',
    messagingSenderId: '681986172316',
    appId: '1:681986172316:web:42d543b4e770c13c691459',
    measurementId: 'G-JK47RZ8129'
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
