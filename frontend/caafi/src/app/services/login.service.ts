import { Injectable } from '@angular/core';
import { LoginData } from '../common/loginData';
import { Observable } from 'rxjs/Observable';
import { RestangularModule, Restangular } from 'ngx-restangular';
import { Http, Response } from '@angular/http';
import 'rxjs/add/operator/delay';
import 'rxjs/add/operator/catch';

@Injectable()
export class LoginService {

  redirectUrl: string;

  constructor(private restangular: Restangular) { }
  
  login(data: LoginData): Observable<LoginData> {
	  console.log("en servicio");
	  console.log(data);
    return this.restangular.all('login').post(data);
  }

}
