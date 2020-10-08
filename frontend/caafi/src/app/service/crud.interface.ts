import { Observable } from 'rxjs';
import { InjectionToken } from '@angular/core';
import { TableInterface } from './table.interface';

/**
 * Interface con los métodos CRUD para los servicios
 */
export interface CRUDInterface<T> extends TableInterface<T> {

  /**
   * Guarda una entidad
   *
   * @param model datos de la entidad
   */
  save(model: T): Observable<T>;

  /**
   * Actualiza una entidad
   *
   * @param model valores nuevos de la entidad
   */
  update(model: T): Observable<T>;

  /**
   * Obtiene una entidad por su identificador
   *
   * @param id identificador del registro
   */
  findById(id: string): Observable<T>;

  /**
   * Elimina una entidad
   *
   * @param id identificador del registro
   */
  delete(id: string): Observable<number>;
}

export declare const CRUD_INTERFACE: InjectionToken<CRUDInterface<any>>;
