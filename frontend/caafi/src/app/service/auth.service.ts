import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, Subject, timer, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { map, takeUntil, switchMap, catchError } from 'rxjs/operators';
import { User } from '../model/user/user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;
  public refreshTokenKiller: Subject<void>;
  public refreshTokenInterval$: Observable<string>;

  constructor(
    private http: HttpClient
  ) {
    this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
    this.currentUser = this.currentUserSubject.asObservable();
    this.refreshTokenKiller = new Subject();
    // Refresca el token cada hora
    this.refreshTokenInterval$ = timer(0, 3600000)
      .pipe(
        // This kills the request if the user closes the component
        takeUntil(this.refreshTokenKiller),
        // switchMap cancels the last request, if no response have been received since last tick
        switchMap(() => this.refreshJWTToken(this.currentUserValue ? this.currentUserValue.token : '')),
        // catchError handles http throws
        catchError(() => of('Error'))
      );
  }

  public refreshJWTToken(token: string): Observable<string> {
    return this.http.post<any>(environment.apiBaseUrl + '/users/refresh-jwt', { token }).pipe(map(response => (response.token)));
  }

  public get currentUserValue(): User {
    return this.currentUserSubject.value;
  }

  public setToken(token: string): void {
    const currentUser: User = this.currentUserValue;
    currentUser.token = token;
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    this.currentUserValue.token = token;
  }

  public setCurrentUser(user: User): void {
    localStorage.setItem('currentUser', JSON.stringify(user));
    this.currentUserSubject.next(user);
  }

  public isUserLogged(): boolean {
    if (this.currentUserValue && this.currentUserValue.token) {
      return true;
    }
    return false;
  }

  public signin(username: string, password: string): Observable<User> {
    return this.http.post<User>(environment.apiBaseUrl + '/users/signin', { username, password })
      .pipe(map(response => {
        // login successful if there's a jwt token in the response
        if (response && response.token) {
          // store user details and jwt token in local storage to keep user logged in between page refreshes
          this.setCurrentUser(response);
        }
        return response;
      }));
  }

  public logout(): void {
    // remove user from local storage to log user out
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(undefined);
    this.refreshTokenKiller.next();
  }
}
