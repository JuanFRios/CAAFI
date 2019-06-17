import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Config } from '../common/config';
import { Restangular } from 'ngx-restangular';
import { HttpClient } from '@angular/common/http';
import { UtilService } from './util.service';

@Injectable()
export class ConfigService {

  constructor(
    private restangular: Restangular,
    private http: HttpClient,
    private utilService: UtilService) { }

  getByName(name: string): Observable<Config> {
    return this.http.get<Config>('config/byname/' + name, this.utilService.getRequestOptions());
  }

  getByNameNoCache(name: string): Observable<Config> {
    return this.restangular.one('config/byname/', name).get();
  }

  getPublicConfigByName(name: string): Observable<Config> {
    return this.http.get<Config>('config/public/byname/' + name, this.utilService.getRequestOptions());
  }

  getTemplateConfig(name: string): Observable<Config> {
    return this.http.get<Config>('config/template/role/' + name, this.utilService.getRequestOptions());
  }

  getDependencyList(): Observable<Config> {
    return this.http.get<Config>('config/reportdependencies', this.utilService.getRequestOptions());
  }

  getDependencyListById(dependency: string): Observable<Config> {
    return this.http.get<Config>('config/reportdependency/' + dependency, this.utilService.getRequestOptions());
  }

  getDependencyFormalName(dependency: string): Observable<Object> {
    return this.http.get<Object>('config/public/dependencyname/' + dependency, this.utilService.getRequestOptions());
  }

  saveConfig(data: Config): Observable<Config> {
    const options: Object = {};
    options['withCredentials'] = true;
    return this.http.post<Config>('config', data, options);
  }

}
