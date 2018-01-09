import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Config } from '../common/config';
import { RestangularModule, Restangular } from 'ngx-restangular';


@Injectable()
export class ConfigService {

  constructor(private restangular: Restangular) { }

  getByName(name: string): Observable<Config> {
    return this.restangular.one('config/byname', name).get();
  }

}
