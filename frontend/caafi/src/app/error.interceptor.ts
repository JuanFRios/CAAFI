import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { AuthService } from './service/auth.service';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  
  constructor(private authService: AuthService, private router: Router) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(catchError(err => {
      if ([401, 403].indexOf(err.status) !== -1 && request.url !== environment.apiBaseUrl + '/users/signin') {
        // auto logout if 401 Unauthorized or 403 Forbidden response returned from api
        this.authService.logout();
        this.router.navigate(['/login']);
      }

      const error = err.error.message || err.statusText;
      return throwError(error);
    }));
  }
}
