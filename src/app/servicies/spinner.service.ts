import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SpinnerService {

  private spinnerSubject: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor() { }

  showSpinner() {
    this.spinnerSubject.next(true);
  }

  hideSpinner() {
    this.spinnerSubject.next(false);
  }

  spinnerObservable() {
    return this.spinnerSubject.asObservable();
  }
}
