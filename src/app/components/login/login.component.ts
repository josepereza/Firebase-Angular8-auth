import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AngularFireAuth } from '@angular/fire/auth';
import { ActivatedRoute } from '@angular/router';
// Me permite seleccionar los diferentis tipos de login
import * as firebase from 'firebase/app';
import { SpinnerService } from 'src/app/servicies/spinner.service';

/**
 * Componente que se encarga de crear una cuenta con correo electronico,
 * loguear con cuenta propia o a traves de alguna red social, la posibilidad
 * de acceder de manera anónima, cerrar sesión y eliminar cualquier cuenta.
 */

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  /** Determina si el usuario esta conectado. */
  userLogged = false;
  /** Determina si el usuario es anónimo. */
  isAnonimous: boolean;
  /** Se almacena la URL cuando regresa del guard. */
  returnUrl: string;
  /** Determina si se muestra la parte de inicio de sesión del toggle. */
  showLoginFlag = false;
  /** Determina si se muestra la parte de registro del toggle. */
  showRegisterFlag = false;
  /** Determina si se muestra la parte de redes sociales del toggle. */
  showSocialFlag = false;
  /** Determina si se muestra la parte de anónimo del toggle. */
  showAnonimFlag = false;

  /**
   * Formulario de registro o de logueo, teniendo en cuenta que
   * la dirección de correo electronico sea valida segun formato
   * xxxxxx@xxxxxx.com
   */
  loginUser = this.fb.group({
    emailJugador: [ '', [Validators.required,
      // tslint:disable-next-line: max-line-length
      Validators.pattern(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)]],
    passwordJugador: [ '', [Validators.required]],
    cambioLoginSignup: [ '', []]
  });

  /**
   * El contructor se fija si el usuario esta conectado o es anonimo y lo guarda en dos variables.
   * Ademas cuando se recien empieza a ejecutarse activa el spinner y cuando termina de traer la
   * información de firebase desactiva el spinner.
   * @param fb Instancia del servicio de FormBuilder
   * @param loginAuth Instancia del servicio de AngularFireAuth
   * @param route Instancia del servicio de ActivatedRoute
   * @param spinner Instancia del servicio de SpinnerService
   */
  constructor(private fb: FormBuilder,
              private loginAuth: AngularFireAuth,
              private route: ActivatedRoute,
              private spinner: SpinnerService) {
    this.spinner.showSpinner();
    this.loginAuth.user
    .subscribe( user => {
      if ( user ) {
        this.userLogged = !!user.email;
        this.isAnonimous = user.isAnonymous;
      } else {
        this.isAnonimous = false;
      }
      this.spinner.hideSpinner();
    });
  }

  /**
   * Desloguea al usuario anónimo por si estaba activo.
   * Dependiendo de que se seleccione en el toogle se ejecuta
   * el inicio de sesión o el registro de cuenta.
   * En el caso de inicio de sesión se ejecuta la función
   * "signInWithEmailAndPassword()" pasandole por parametro
   * el correo electronico y la contraseña del formulario.
   * En el caso de registro de cuenta se ejecuta la función
   * "createUserWithEmailAndPassword()" pasandole por parametro
   * el correo electronico y la contraseña del formulario.
   * En ambos casos se controla el flujo de errores.
   */
  login() {
    const email = this.loginUser.value.emailJugador;
    const password = this.loginUser.value.passwordJugador;
    const toggle = this.loginUser.value.cambioLoginSignup;

    if (this.isAnonimous) {
      this.anonimLogout();
    }
    if ( toggle === 'register') {
      this.loginAuth.auth.createUserWithEmailAndPassword(email, password)
      .then( data => {
          confirm('Se ha creado la cuenta con el correo: ' + data.user.email +
          '. Ademas se ha iniciado sesion de manera automatica, buena partida!');
          this.userLogged = true;
      })
      .catch( err => {
        if ( err.code === 'auth/email-already-in-use' ) {
          confirm('Este correo ya se encuentra en uso, por favor seleccione otro.');
        } else {
          confirm('Ha ocurrido un error inesperado con el registro.');
        }
      });
    } else {
      this.loginAuth.auth.signInWithEmailAndPassword(email, password)
      .then( data => {
        this.setLocalstorage();
        confirm('Ingreso como: ' + data.user.email);
        this.userLogged = true;
      })
      .catch( err => {
        if ( err.code === 'auth/user-not-found' ) {
          confirm('No se encontro el correo ingresado, por favor seleccione otro.');
        } else if ( err.code === 'auth/wrong-password' ) {
          confirm('La contraseña introducida es erronea, por favor seleccione otra.');
        } else {
          confirm('Ha ocurrido un error inesperado con el acceso.');
        }
      });
    }
  }
  /**
   * Desloguea al usuario anónimo por si estaba activo.
   * Envia un correo de recuperacion de contraseña al correo indicado
   * como parametro a la función sendPasswordResetEmail() controlando
   * los errores.
   * Este correo que se genera de manera automática puede ser personalizado
   * en las configuraciones de las plantillas de Authentication en firebase.
   */
  changePassword() {
    const email = this.loginUser.value.emailJugador;

    if (this.isAnonimous) {
      this.anonimLogout();
    }
    if ( confirm('Se enviará la recuperacion de contraseña al correo: ' + email + ', ¿Está seguro?') ) {
      this.loginAuth.auth.sendPasswordResetEmail( email )
      .then( res => {
        confirm('Se ha enviado exitosamente el correo de cambio de contraseña.');
      })
      .catch( err => {
        if ( err.code === 'auth/user-not-found' ) {
          confirm('No existe el correo ingresado, por favor seleccione otro.');
        } else {
          confirm('Ha ocurrido un error inesperado al enviar el correo de cambio de contraseña.');
        }
      });
    }
  }
  /**
   * Invoca a la función que guarda en el localstorage y desloguea
   * al usuario anónimo por si estaba activo.
   * Creación de cuenta y/o inicio de sesión a traves de Google,
   * usando la función "signInWithRedirect()" con el provider de Google
   * "GoogleAuthProvider()" y controlando los posibles errores.
   * La función "signInWithRedirect()" y "signInWithPopup()" hacen las
   * mismas funciones, con la diferencia que uno crea una ventana emergente
   * y el otro una redireccion en la misma pestaña.
   */
  googleLogin() {
    this.setLocalstorage();
    if (this.isAnonimous) {
      this.anonimLogout();
    }
    // Funciona bien en Chrome pero en Firefox y Android crea una pestaña y no sabe volver.
    // this.loginAuth.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
    // Funciona bien en Chrome y Firefox pero NO en Android nativo, no aparece el redirect.
    this.loginAuth.auth.signInWithRedirect(new firebase.auth.GoogleAuthProvider())
    .catch( err => {
      console.log(err);
    });

  }
  /**
   * Invoca a la función que guarda en el localstorage y desloguea
   * al usuario anónimo por si estaba activo.
   * Creación de cuenta y/o inicio de sesión a traves de Facebook,
   * usando la función "signInWithRedirect()" con el provider de Facebook
   * "FacebookAuthProvider()" y controlando los posibles errores.
   * La función "signInWithRedirect()" y "signInWithPopup()" hacen las
   * mismas funciones, con la diferencia que uno crea una ventana emergente
   * y el otro una redireccion en la misma pestaña.
   */
  facebookLogin() {
    this.setLocalstorage();
    if (this.isAnonimous) {
      this.anonimLogout();
    }
    // Funciona bien en Chrome pero en Firefox y Android crea una pestaña y no sabe volver.
    // this.loginAuth.auth.signInWithPopup(new firebase.auth.FacebookAuthProvider());
    // Funciona bien en Chrome y Firefox pero NO en Android nativo, no aparece el redirect.
    this.loginAuth.auth.signInWithRedirect(new firebase.auth.FacebookAuthProvider())
    .catch( err => {
      if ( err.code === 'auth/account-exists-with-different-credential' ) {
        confirm('El correo electronico usado con la cuenta de Facebook ya esta registrado!');
      } else {
        console.log(err);
      }
    });
  }
  /** Inicio de sesión creando una cuenta anónima, esta cuenta anónima
   * eventualmente puede transformarse en una cuenta con correo
   * electronico manteniendo toda la información que pudiera tener.
   */
  anonimLogin() {
    this.setLocalstorage();
    this.loginAuth.auth.signInAnonymously()
    .catch( err => {
      confirm('Problemas para logearte de manera anonima!');
    });
  }
  /** Elimino la cuenta temporal del user anonimo. */
  anonimLogout() {
    this.loginAuth.auth.currentUser.delete();
  }
  /**
   * Elimina la cuenta que esta logueada en ese momento con la función "delete()"
   * controlando el flujo de error y ademas cerrando la sesion al usuario.
   */
  deleteUser() {
    if ( confirm('Vas a eliminar tu cuenta de manera permanente, ¿Estás seguro?') ) {
      this.loginAuth.auth.currentUser.delete().
      then( res => {
        confirm('Se ha eliminado exitosamente!');
        this.loginAuth.auth.signOut()
        .then( del => {
          confirm('Sesion cerrada por eliminación de cuenta.');
          this.userLogged = false;
        });
      }).catch( err => {
        confirm('Ha ocurrido un error inesperado al intentar eliminar la cuenta.');
      });
    }
  }
  /**
   * Cierra cualquier sesión que este iniciada con la funcion "signOut()"
   * y lo despliega en un confirm() al uduario.
   */
  logout() {
    if ( confirm('¿Está seguro que desea cerrar la sesion?') ) {
      this.loginAuth.auth.signOut()
      .then( del => {
        confirm('Sesion cerrada!');
        this.userLogged = false;
      });
    }
  }
  /** Guarda en el localStorage el queryParamMap que recata del guard. */
  setLocalstorage() {
    // Rescato la URL que se intento entrar y la guardo en localstorage, si no existe uso '/'
    this.returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') || '/';
    localStorage.setItem('returnUrl', this.returnUrl);
  }
  /** Ocualta todo menos el form de login. */
  showLogin() {
    this.showLoginFlag = true;
    this.showRegisterFlag = false;
    this.showSocialFlag = false;
    this.showAnonimFlag = false;
  }
  /** Ocualta todo menos el form de registro. */
  showRegister() {
    this.showLoginFlag = false;
    this.showRegisterFlag = true;
    this.showSocialFlag = false;
    this.showAnonimFlag = false;
  }
  /** Ocualta todo menos las redes sociales. */
  showSocial() {
    this.showLoginFlag = false;
    this.showRegisterFlag = false;
    this.showSocialFlag = true;
    this.showAnonimFlag = false;
  }
  /** Ocualta todo menos el acceso anónimo. */
  showAnonim() {
    this.showLoginFlag = false;
    this.showRegisterFlag = false;
    this.showSocialFlag = false;
    this.showAnonimFlag = true;
  }
}
