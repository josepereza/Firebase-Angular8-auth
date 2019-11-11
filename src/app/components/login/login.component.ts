import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AngularFireAuth } from '@angular/fire/auth';
import { ActivatedRoute } from '@angular/router';
// Me permite seleccionar los diferentis tipos de login
import * as firebase from 'firebase/app';
import { SpinnerService } from 'src/app/servicies/spinner.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  userLogged = false;
  returnUrl: string;
  isAnonimous: boolean;

  showLoginFlag = false;
  showRegisterFlag = false;
  showSocialFlag = false;
  showAnonimFlag = false;

  // Formulario para el login del jugador
  loginUser = this.fb.group({
    emailJugador: [ '', [Validators.required,
      // tslint:disable-next-line: max-line-length
      Validators.pattern(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)]],
    passwordJugador: [ '', [Validators.required]],
    cambioLoginSignup: [ '', []]
  });

  constructor(private fb: FormBuilder,
              public loginAuth: AngularFireAuth,
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

  ngOnInit() {
  }

  // Usuarios con correo electronico
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
  // Usuarios con Google
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
  // Usuarios con Facebook
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
  // Usiarios con anonimato
  anonimLogin() {
    this.setLocalstorage();
    this.loginAuth.auth.signInAnonymously()
    .catch( err => {
      confirm('Problemas para logearte de manera anonima!');
    });
  }
  anonimLogout() {
    this.loginAuth.auth.currentUser.delete();
  }
  // Logout y delete son comunes para cualquier autenticacion.
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
  logout() {
    if ( confirm('¿Está seguro que desea cerrar la sesion?') ) {
      this.loginAuth.auth.signOut()
      .then( del => {
        confirm('Sesion cerrada!');
        this.userLogged = false;
      });
    }
  }
  // Otros
  setLocalstorage() {
    // Rescato la URL que se intento entrar y la guardo en localstorage, si no existe uso '/'
    this.returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') || '/';
    localStorage.setItem('returnUrl', this.returnUrl);
  }
  showLogin() {
    this.showLoginFlag = true;
    this.showRegisterFlag = false;
    this.showSocialFlag = false;
    this.showAnonimFlag = false;
  }
  showRegister() {
    this.showLoginFlag = false;
    this.showRegisterFlag = true;
    this.showSocialFlag = false;
    this.showAnonimFlag = false;
  }
  showSocial() {
    this.showLoginFlag = false;
    this.showRegisterFlag = false;
    this.showSocialFlag = true;
    this.showAnonimFlag = false;
  }
  showAnonim() {
    this.showLoginFlag = false;
    this.showRegisterFlag = false;
    this.showSocialFlag = false;
    this.showAnonimFlag = true;
  }
}
