import { Pageable } from '../model/resource/table/pageable';
import { Observable } from 'rxjs';
import { Page } from '../model/resource/table/page';
import { InjectionToken } from '@angular/core';

export interface TableInterface<T> {

  /**
   * Obtiene todos los elementos de la entidad paginados
   *
   * @param pagebale valores de número de página, tamaño de pagína y ordenamiento
   */
  findAll(pagebale: Pageable): Observable<Page<T>>;
}

export declare const TABLE_INTERFACE: InjectionToken<TableInterface<any>>;
