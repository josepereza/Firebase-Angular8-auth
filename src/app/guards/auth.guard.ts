import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { map } from 'rxjs/operators';

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
