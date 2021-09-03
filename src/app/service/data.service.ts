import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Pageable } from '../model/resource/table/pageable';
import { Observable } from 'rxjs';
import { Page } from '../model/resource/table/page';
import { environment } from 'src/environments/environment';
import { Data } from '../model/template/data';
import { map } from 'rxjs/operators';
import { DataInterface } from './data.interface';

@Injectable({
  providedIn: 'root'
})
export class DataService implements DataInterface<any> {

  public templateId: string;
  public unidadId: string;

  constructor(
    public http: HttpClient
  ) {}

  /**
   * Obtiene todos los elementos de la entidad paginados
   *
   * @param pagebale valores de número de página, tamaño de pagína y ordenamiento
   */
  public findAll(pageable: Pageable): Observable<Page<any>> {
    return this.http.get<Page<any>>(environment.apiBaseUrl + '/data', 
      { 
        params: { 
          templateId: this.templateId,
          unidadId: this.unidadId,
          page: pageable.page.toString(),
          size: pageable.size.toString(),
          sort: pageable.sort,
          filter: pageable.filter,
          filterFields: pageable.filterFields,
        }
      }
    ).pipe(
      map(page => {
        page.content = page.content.map(data => {
          const newData = data.data;
          newData.id = data.id;
          return newData
        });
        return page;
      })
    );
  }

  /**
   * Guarda una entidad
   *
   * @param model datos de la entidad
   */
  public save(model: any): Observable<any> {
    const data: Data = {
      templateId: this.templateId,
      unidadId: this.unidadId,
      data: model
    }
    return this.http.post<any>(environment.apiBaseUrl + '/data', data);
  }

  /**
   * Actualiza una entidad
   *
   * @param model valores nuevos de la entidad
   */
  public update(model: any): Observable<any> {
    const id = model.id;
    delete model.id;
    const data: Data = {
      id,
      templateId: this.templateId,
      unidadId: this.unidadId,
      data: model
    }
    return this.http.put<any>(environment.apiBaseUrl + '/data/' + id, data);
  }

  /**
   * Obtiene una entidad por su identificador
   *
   * @param id identificador del registro
   */
  public findById(id: string): Observable<any> {
    return this.http.get<any>(environment.apiBaseUrl + '/data/' + id, { params: { templateId: this.templateId } }).pipe(
      map(data => {
        const newData = data.data;
        newData.id = data.id;
        return newData;
      })
    );
  }

  /**
   * Elimina una entidad
   *
   * @param id identificador del registro
   */
  public delete(id: string): Observable<number> {
    return this.http.delete<number>(environment.apiBaseUrl + '/data/' + id, { params: { templateId: this.templateId } });
  }

  /**
   * Descarga el archivo de datos
   */
  public download(activeColumn = 'lastModifiedDate', direction = 'desc', filter?: string, filterFields?: string[]): Observable<Blob> {
    return this.http.get(environment.apiBaseUrl + '/data/download', { params: { 
      templateId: this.templateId,
      unidadId: this.unidadId,
      page: '0',
      size: '-1',
      sort: direction !== '' ? [activeColumn + ',' + direction] : ['lastModifiedDate,desc'],
      filter: filter && filter.trim() !== '' ? filter : '',
      filterFields
    }, responseType: 'blob' });
  }
}
