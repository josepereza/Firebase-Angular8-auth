import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

/**
 * Servicio para poder controlar (por medio de un BehaviorSubject) el estado del
 * spinner de espera que se muestra en la aplicación.
 */

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
