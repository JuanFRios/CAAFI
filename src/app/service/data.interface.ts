import { CRUDInterface } from './crud.interface';
import { Observable } from 'rxjs';
import { InjectionToken } from '@angular/core';

export interface DataInterface<T> extends CRUDInterface<T> {

  /**
   * Método para la descarga de datos
   */
  download(activeColumn: string, direction: string, filter?: string, filterFields?: string[]): Observable<any>;
}

export declare const DATA_INTERFACE: InjectionToken<DataInterface<any>>;
