import { Injectable } from '@angular/core';
import { ResourceInterface } from './resource.interface';
import { Table } from '../model/resource/table/table';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TableService implements ResourceInterface<Table> {

  constructor(
    private http: HttpClient
  ) {}

  public findById(id: string): Observable<Table> {
    return this.http.get<Table>(environment.apiBaseUrl + '/tables/' + id);
  }
}
