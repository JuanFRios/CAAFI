import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Config } from '../common/config';
import { RestangularModule, Restangular } from 'ngx-restangular';


@Injectable()
export class ConfigService {

  constructor(private restangular: Restangular) { }

  getByName(name: string): Observable<Config> {
    return this.restangular.one('config/byname', name).get();
  }

  getPublicConfigByName(name: string): Observable<Config> {
    return this.restangular.one('config/public/byname', name).get();
  }

  getTemplateConfig(name: string): Observable<Config> {
    return this.restangular.one('config/template/role', name).get();
  }

  getDependencyList(): Observable<Config> {
    return this.restangular.one('config/reportdependencies').get();
  }

  getDependencyListById(dependency: string): Observable<Config> {
    return this.restangular.one('config/reportdependency/' + dependency).get();
  }

}
