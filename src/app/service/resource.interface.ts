import { Observable } from 'rxjs';

/**
 * Interface para el manejo de recursos como menús, formularios, listas desplegables, etc...
 */
export interface ResourceInterface<T> {

  /**
   * Obtiene un recurso de tipo T por el ID
   *
   * @param id ID del recurso
   */
  findById(id: string): Observable<T>;
}
