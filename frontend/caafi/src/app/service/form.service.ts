import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { ResourceInterface } from './resource.interface';
import { ListItem } from '../model/resource/form/list-item';
import { Form } from '../model/resource/form/form';

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

  public findListByName(name: string): Observable<string[]> {
    return this.http.get<string[]>(environment.apiBaseUrl + '/forms/lists/' + name);
  }

  public findListByEntityName(entityName: string): Observable<ListItem[]> {
    return this.http.get<ListItem[]>(environment.apiBaseUrl + '/' + entityName + '/formList');
  }
}
