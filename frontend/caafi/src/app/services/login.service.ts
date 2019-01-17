import { Injectable } from '@angular/core';
import {
    CanActivate, Router,
    ActivatedRouteSnapshot,
    RouterStateSnapshot
} from '@angular/router';
import { LoginData } from '../common/loginData';
import { Headers, Response } from '@angular/http';


import { baseURL } from '../common/baseurl';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable()
export class LoginService implements CanActivate {

    redirectUrl: string;
    loginUser: any;

    constructor(public http: HttpClient, private router: Router) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
        return new Promise<boolean>((resolve) => {
            this.check().subscribe(() => {
                if (this.isLogIn()) {
                    console.log('Is Login', localStorage.getItem('tokenUser'));
                    resolve(true);
                } else {
                    this.router.navigate(['/home']);
                    resolve(false);
                }
            }, () => {
                if (localStorage.getItem('tokenUser')) {
                    localStorage.removeItem('tokenUser');
                }
                this.router.navigate(['/home']);
                resolve(false);
            });
        });
    }

    isLogIn(): boolean {
        return localStorage.getItem('tokenUser') != null;
    }

    login(data: LoginData) {
        const base64Credential: string = btoa(data.username + ':' + data.password);
        let headers = new HttpHeaders();
        headers = headers.set('Accept', 'application/json')
            .set('Authorization', 'Basic ' + base64Credential)
            .set('X-Requested-With', 'XMLHttpRequest');
        const options: Object = {};
        options['withCredentials'] = true;
        options['headers'] = headers;
        return this.http.get(baseURL + '/account/login', options)
            .map((response: Response) => {
                // login successful if there's a jwt token in the response
                const user = response['user']; // the returned user object is a
                // principal object
                localStorage.setItem('tokenUser', response['token']);
                if (user) {
                    // store user details in local storage to keep user logged in
                    // between page refreshes
                    this.loginUser = user;
                }
            });
    }

    logOut() {
        const options: Object = {};
        options['withCredentials'] = true;

        return this.http.get(baseURL + '/account/logout', options)
            .map(() => {
            });
    }

    check() {
        let headers = new HttpHeaders();
        headers = headers.set('X-Requested-With', 'XMLHttpRequest');
        const options: Object = {};
        options['withCredentials'] = true;
        options['headers'] = headers;
        return this.http.get(baseURL + '/account/check', options)
            .map((response: Response) => {
                return response['response'];
            });
    }

    checkStatus() {
        this.check().subscribe(() => {
        }, () => {
            if (localStorage.getItem('tokenUser')) {
                localStorage.removeItem('tokenUser');
                this.router.navigate(['/home']);
            }
        });
    }

}
