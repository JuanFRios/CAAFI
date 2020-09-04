import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { ResourceInterface } from './resource.interface';
import { Form } from '../model/resource/form/form';
import { List } from '../model/resource/form/list/list';

@Injectable({
  providedIn: 'root'
})
export class FormService implements ResourceInterface<Form> {

  private currentloadingSubject: BehaviorSubject<boolean>;
  public currentLoading: Observable<boolean>;

  constructor(
    private http: HttpClient
  ) {
    this.currentloadingSubject = new BehaviorSubject<boolean>(true);
    this.currentLoading = this.currentloadingSubject.asObservable();
  }

  public toggleLoading(value: boolean) {
    this.currentloadingSubject.next(value);
  }

  public findById(id: string): Observable<Form> {
    return this.http.get<Form>(environment.apiBaseUrl + '/forms/' + id);
  }

  public findListById(id: string): Observable<List> {
    return this.http.get<List>(environment.apiBaseUrl + '/forms/lists/' + id);
  }

  public findListByEntityName(entityName: string): Observable<List> {
    return this.http.get<List>(environment.apiBaseUrl + '/' + entityName + '/formList');
  }
}
