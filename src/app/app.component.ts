import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { SpinnerService } from './servicies/spinner.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  showSpinner = false;

  constructor(private router: Router, public loginAuth: AngularFireAuth, private spinner: SpinnerService) {}

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
