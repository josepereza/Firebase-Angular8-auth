/**
 * La variable firebaseConfig la podemos obtener despues de crear un proyecto web
 * en firebase, desde la parte de "Settings" de la cuenta de firebase podemos acceder
 * a nuestros proyectos, y en el web se encuentra esta variable en "Firebase SDK snippet".
 * Gracias a esta variable podemos acceder a todas las funcionalidades web que ofrece
 * firebase.
 */
export const environment = {
  production: true,
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
