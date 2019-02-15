import { Injectable } from '@angular/core';
import { Template } from '../common/template';
import { Observable } from 'rxjs';
import { RestangularModule, Restangular } from 'ngx-restangular';

@Injectable()
export class TemplatesService {

  constructor(private restangular: Restangular) { }

  getAll(): Observable<Template[]> {
    return this.restangular.all('template').getList();
  }

  getByName(name: string): Observable<Template> {
    return this.restangular.one('template/byname', name).get();
  }

  getPublicTemplateByName(name: string): Observable<Template> {
    return this.restangular.one('template/public/byname', name).get();
  }

  senTemplateByEmail(template: string, emails: string, url: string): Observable<any> {
    return this.restangular.all('template/sendtemplatebymail/' + template).post({'emails': emails, 'url': url});
  }

  saveTemplateConfig(data: Template): Observable<any> {
    return this.restangular.all('template').post(data);
  }

}
