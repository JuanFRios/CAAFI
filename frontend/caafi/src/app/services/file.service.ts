import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { baseURL } from '../common/baseurl';
import { RestangularModule, Restangular } from 'ngx-restangular';

@Injectable()
export class FileService {

  constructor(private restangular: Restangular) { }

  /**
   * uoloads a file to server
   * @param file FormData
   */
  upload(file: FormData): Observable<FormData> {
    return this.restangular.all('file').post(file);
  }
}
