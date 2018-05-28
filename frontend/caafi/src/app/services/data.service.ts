import { Injectable } from '@angular/core';
import { Data } from '../common/data';
import { Observable } from 'rxjs/Observable';
import { RestangularModule, Restangular } from 'ngx-restangular';

@Injectable()
export class DataService {

  constructor(private restangular: Restangular) { }

  getAll(): Observable<Data[]> {
    return this.restangular.all('data').getList();
  }

  getAllByTemplate(template: String): Observable<Data[]> {
    return this.restangular.all('data/bytemplate/'+template).getList();
  }

  getAllByTemplateAndDependency(template: string, dependency: string): Observable<Data[]> {
    return this.restangular.one('data/bytemplateanddependency/' + dependency + '/' + template).get();
  }

  getByJson(json: string,fields: string): Observable<any[]> {
    return this.restangular.all('data/byJson/'
    +json+"/"+fields).getList();
  }

  getById(id: number): Observable<Data> {
    return this.restangular.one('data/byid', id).get();
  }

  save(data: Data): Observable<Data> {
    return this.restangular.all('data').post(data);
  }

  delete(id: number): Observable<Data> {
    return this.restangular.one('data/byid', id).remove();
  }

}
