import { Pageable } from '../model/resource/table/pageable';
import { Observable } from 'rxjs';
import { Page } from '../model/resource/table/page';
import { InjectionToken } from '@angular/core';

/**
 * Interface con los métodos CRUD para los servicios
 */
export interface CRUDInterface<T> {

  /**
   * Obtiene todos los elementos de la entidad paginados
   *
   * @param pagebale valores de número de página, tamaño de pagína y ordenamiento
   */
  findAll(pagebale: Pageable): Observable<Page<T>>;

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
