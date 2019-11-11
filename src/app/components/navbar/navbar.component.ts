import { Component, ViewChild } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { AngularFireAuth } from '@angular/fire/auth';
import { MatSidenav } from '@angular/material';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {

  userlogged = false;
  isAnonimous: boolean;

  @ViewChild('drawer', {static: false} ) drawer: MatSidenav;

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

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

    close() {
      if ( window.innerWidth <= 600 ) {
        this.drawer.close();
      }
    }
}
