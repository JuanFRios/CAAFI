import { Injectable } from '@angular/core';
import { Menu } from '../model/resource/menu/menu';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MenuService {

  constructor(private http: HttpClient) { }

  public getMenuPrincipal(): Observable<Menu> {
    return this.http.get<Menu>(environment.apiBaseUrl + '/menus/principal');
  }
}
