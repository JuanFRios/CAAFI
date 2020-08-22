import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Formulario } from '../model/template/formulario/formulario';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FormularioService {

  constructor(private http: HttpClient) { }

  public findById(id: string): Observable<Formulario> {
    return this.http.get<Formulario>(environment.apiBaseUrl + '/formularios/' +  id);
  }
}
