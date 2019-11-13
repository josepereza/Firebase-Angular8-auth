import { Component, ViewChild } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { AngularFireAuth } from '@angular/fire/auth';
import { MatSidenav } from '@angular/material';

/**
 * Componente de Navbar que se esconde segun el usuario tenga o no iniciada la sesión.
 * Fue creado de manera automatica por el comando de Schematics => ng generate @angular/material:dashboard navbar
 */

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {

  /** Determina si el usuario esta conectado. */
  userlogged = false;
  /** Determina si el usuario es anónimo. */
  isAnonimous: boolean;

  /** ViewChild que esta pendiente del comportamiento del drawer de opciones del navbar. */
  @ViewChild('drawer', {static: false} ) drawer: MatSidenav;

  /** Obserbable que esta pendiente del punto de quiebre del navbar. */
  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  /**
   * El contructor se fija si el usuario esta conectado o es anonimo y lo guarda en dos variables.
   * @param loginAuth Instancia del servicio de autenticación de firebase.
   */
  constructor(private breakpointObserver: BreakpointObserver, public loginAuth: AngularFireAuth) {
    this.loginAuth.user
    .subscribe( user => {
      if ( user ) {
        this.userlogged = true;
        this.isAnonimous = user.isAnonymous;
      } else {
        this.userlogged = false;
        this.isAnonimous = false;
      }
    });
  }

  /** Cierra el drawer si la pantalla es igual o menor que 600 pixeles. */
  close() {
    if ( window.innerWidth <= 600 ) {
      this.drawer.close();
    }
  }
}
