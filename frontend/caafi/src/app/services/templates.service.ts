import { Injectable } from '@angular/core';
import { Template } from '../common/template';
import { Observable } from 'rxjs';
import { RestangularModule, Restangular } from 'ngx-restangular';
import { UtilService } from './util.service';
import { HttpClient } from '@angular/common/http';

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

  senTemplateByEmail(template: string, emails: string, url: string): Observable<any> {
    return this.restangular.all('template/sendtemplatebymail/' + template).post({'emails': emails, 'url': url});
  }

  saveTemplateConfig(data: Template): Observable<any> {
    return this.restangular.all('template').post(data);
  }

}
