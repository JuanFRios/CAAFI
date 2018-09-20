import { Injectable } from '@angular/core';
import { Template } from '../common/template';
import { Observable } from 'rxjs/Observable';
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

  senTemplateByEmail(template: string, emails: string): Observable<string> {
    return this.restangular.all('template/sendtemplatebymail/' + template).post({emails: emails});
  }

}
