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

  /** Creo un BehaviorSubject porque este tipo de subject puede tener un valor inicial. */
  private spinnerSubject: BehaviorSubject<boolean> = new BehaviorSubject(false);

  /** Setea el valor del BehaviorSubject en true con un next. */
  showSpinner() {
    this.spinnerSubject.next(true);
  }

  /** Setea el valor del BehaviorSubject en false con un next. */
  hideSpinner() {
    this.spinnerSubject.next(false);
  }

  /**
   * Retorna el BehaviorSubject como si fuera unobservable para que pueda ser
   * usado desde cualquier lugar de la aplicación.
   */
  spinnerObservable() {
    return this.spinnerSubject.asObservable();
  }
}
