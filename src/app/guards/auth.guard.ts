import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { map } from 'rxjs/operators';

/**
 * Este guard se fija que no se pueda acceder a cierta URL sin tener iniciada la sesión
 * de algún usuario en firebase y redireccionarlo adecuadamente.
 */

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  /** Variable que determina si el usuario tiene sesión iniciada. */
  userLogged: boolean;

  /**
   * Instanciador ser servicios.
   * @param loginAuth Instancia el servicio de autenticación de firebase
   * @param router Instancia el servicio del Router
   */
  constructor(public loginAuth: AngularFireAuth, private router: Router) {}

  /**
   * Si el usuario esta conectado lo deja pasar a la URL solicitada.
   * En caso de que no este conectado de lo redirecciona a la pagina principal
   * o a traves de queryParams retorna la URL a la que se intento acceder originalmente.
   * @param next Propio de canActivate
   * @param state Propio de canActivate
   */
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
