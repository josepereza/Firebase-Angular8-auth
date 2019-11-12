import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { SpinnerService } from './servicies/spinner.service';

/**
 * Componente principal donde se muestra siempre el navbar.
 */

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  /**
   * Variable que determina si se muestra el spinner o el navbar.
   */
  showSpinner = false;

  constructor(private router: Router, public loginAuth: AngularFireAuth, private spinner: SpinnerService) {}

  /**
   * Subscripcion al valor del spinner. En caso de tener un usuario conectado y una URL por queryparams,
   * usa esta URL para volver a donde quiso entrar el usuario en primer lugar. Caso contrario ira al login.
   */
  ngOnInit() {
    this.spinner.spinnerObservable()
    .subscribe( res => {
      this.showSpinner = res;
    });
    this.loginAuth.user
    .subscribe( user => {
      if ( user ) {
        const returnUrl = localStorage.getItem('returnUrl');
        localStorage.removeItem('returnUrl');
        if ( returnUrl ) {
          this.router.navigateByUrl(returnUrl);
        }
      }
    });
  }
}
