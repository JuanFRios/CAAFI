import { Injectable } from '@angular/core';
import { Template } from '../common/template';
import { Observable } from 'rxjs';
import { RestangularModule, Restangular } from 'ngx-restangular';
import { UtilService } from './util.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable()
export class TemplatesService {

  constructor(
    private restangular: Restangular,
    private http: HttpClient,
    private utilService: UtilService) { }

  getAll(): Observable<Template[]> {
    return this.restangular.all('template').getList();
  }

  getByName(name: string): Observable<Template> {
    return this.http.get<Template>('template/byname/' + name, this.utilService.getRequestOptions());
  }

  getPublicTemplateByName(name: string): Observable<Template> {
    return this.http.get<Template>('template/public/byname/' + name, this.utilService.getRequestOptions());
  }

  senTemplateByEmail(template: string, configId: string): Observable<any> {
    return this.restangular.all('template/sendtemplatebymail/' + template + '/' + configId).post();
  }

  saveTemplateConfig(data: Template): Observable<any> {
    const options: Object = {};
    options['withCredentials'] = true;
    return this.http.post<Template>('template/config', data, options);
  }

  getTemplateConfig(formId: string, configId: string) {
    return this.http.get<Template>('template/config/' + formId + '/' + configId, this.utilService.getRequestOptions());
  }

}
