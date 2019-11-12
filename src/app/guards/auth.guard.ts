import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { map } from 'rxjs/operators';

/**
 * Este es el guard que se fija que no se pueda acceder a cierta URL sin tener iniciada la sesión
 * de algún usuario en firebase.
 * Además también a traves de queryParams retorna la URL a la que se intento acceder para en caso
 * de tener los permisos necesarios, tras iniciar sesión de forma exitosa se lo redireccione
 * automaticamente a esa URL original.
 */

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  userLogged: boolean;

  constructor(public loginAuth: AngularFireAuth, private router: Router) {}

  canActivate( next: ActivatedRouteSnapshot, state: RouterStateSnapshot): any {
    return this.loginAuth.user
    .pipe(
      map( user => {
        if ( user ) {
          return true;
        }
        alert('Para acceder a la URL deseada debe tener la sesión iniciada, sera redirigido al login de la página.');
        this.router.navigate(['/'], { queryParams: { returnUrl: state.url } });
        return false;
      })
    );
  }
}
