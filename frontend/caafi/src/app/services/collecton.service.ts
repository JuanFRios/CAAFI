import { Injectable } from '@angular/core';
import { Template } from '../common/template';
import { Observable } from 'rxjs';
import { RestangularModule, Restangular } from 'ngx-restangular';
import { UtilService } from './util.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Workplan } from '../common/workplan';

@Injectable()
export class CollectionService {

  constructor(
    private restangular: Restangular,
    private http: HttpClient,
    private utilService: UtilService) { }

  getByName(collection: string): Observable<Workplan> {
    return this.http.get<Workplan>(collection, this.utilService.getRequestOptions());
  }

}
