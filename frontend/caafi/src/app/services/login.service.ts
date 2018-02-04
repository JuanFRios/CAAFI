import { Injectable } from '@angular/core';
import {
	CanActivate, Router,
	ActivatedRouteSnapshot,
	RouterStateSnapshot,
	CanActivateChild,
	NavigationExtras,
	CanLoad, Route
} from '@angular/router';
import { LoginData } from '../common/loginData';
import { Observable } from 'rxjs/Observable';
import { RestangularModule, Restangular } from 'ngx-restangular';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import 'rxjs/add/operator/delay';
import 'rxjs/add/operator/catch';
import { baseURL } from '../common/baseurl';

@Injectable()
export class LoginService implements CanActivate {

	redirectUrl: string;
	loginUser: any;

	constructor(private restangular: Restangular, public http: Http, private router: Router) { }

	canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
		if (this.isLogIn()) {
			return true;
		}
		this.router.navigate(['/home']);
		return false;
	}

	isLogIn(): boolean {
		return localStorage.getItem('tokenUser') != null;
	}

	login(data: LoginData) {
		let headers = new Headers();
		headers.append('Accept', 'application/json')
		// creating base64 encoded String from user name and password
		var base64Credential: string = btoa(data.username + ':' + data.password);

		headers.append("Authorization", "Basic " + base64Credential);
		headers.append("X-Requested-With", "XMLHttpRequest");
		let options = new RequestOptions();
		options.withCredentials = true
		options.headers = headers;
		return this.http.get(baseURL + "/account/login", options)
			.map((response: Response) => {
				// login successful if there's a jwt token in the response
				let user = response.json().user;// the returned user object is a
				// principal object
				localStorage.setItem('tokenUser', response.json().token);
				console.log(response.json().token);
				if (user) {
					// store user details in local storage to keep user logged in
					// between page refreshes
					this.loginUser = user;
				}
			});
	}

	logOut() {
		let options = new RequestOptions();
		options.withCredentials = true

		return this.http.get(baseURL + "/account/logout", options)
			.map((response: Response) => {
			});
	}

	check() {
		let options = new RequestOptions();
		options.withCredentials = true

		return this.http.get(baseURL + "/account/check", options)
			.map((response: Response) => {
				console.log(response);
			});
	}

}
