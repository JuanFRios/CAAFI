import { Injectable } from '@angular/core';
import { LoginData } from '../common/loginData';
import { Observable } from 'rxjs/Observable';
import { RestangularModule, Restangular } from 'ngx-restangular';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import 'rxjs/add/operator/delay';
import 'rxjs/add/operator/catch';
import { baseURL } from '../common/baseurl';

@Injectable()
export class LoginService {

  redirectUrl: string;
authHeader: string;

  constructor(private restangular: Restangular,public http: Http) { }
  
  login(data: LoginData){
	  console.log("en servicio");
	  console.log(data);
	  let headers = new Headers();
	    headers.append('Accept', 'application/json')
	    // creating base64 encoded String from user name and password
	    var base64Credential: string = btoa( data.username+ ':' + data.password);
	    
	    headers.append("Authorization", "Basic " + base64Credential);
	    headers.append("X-Requested-With", "XMLHttpRequest");
	    let options = new RequestOptions();
	    options.withCredentials = true
	    options.headers=headers;
	   return this.http.get(baseURL+"/account/login" ,   options)
	      .map((response: Response) => {
	      // login successful if there's a jwt token in the response
	      let user = response.json().principal;// the returned user object is a principal object
	      console.log(response.json().token);
	      if (user) {
	        // store user details  in local storage to keep user logged in between page refreshes
	        localStorage.setItem("user", user);
	      }
	    });
	  }

logOut() {
    // remove user from local storage to log user out
    return this.http.post(baseURL+"/logout",{})
      .map((response: Response) => {
        localStorage.removeItem('xAuthToken');
      });

  }

}
