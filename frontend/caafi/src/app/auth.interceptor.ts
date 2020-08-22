import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './service/auth.service';
import { environment } from 'src/environments/environment';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

    constructor(
      private authService: AuthService
    ) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
      if (request.url.startsWith(environment.apiBaseUrl) && this.authService.isUserLogged()) {
          request = request.clone({
            setHeaders: {
              Authorization: 'Bearer ' + this.authService.currentUserValue.token
            }
          });
      }
      return next.handle(request);
    }
}
