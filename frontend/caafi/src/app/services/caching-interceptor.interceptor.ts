import { baseURL } from '../common/baseurl';
import { Injectable } from '@angular/core';
import { HttpEvent, HttpRequest, HttpResponse, HttpInterceptor, HttpHandler } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { startWith, tap } from 'rxjs/operators';
import 'rxjs/add/observable/of';

import { RequestCache } from './request-cache.service';

@Injectable()
export class CachingInterceptor implements HttpInterceptor {
  constructor(private cache: RequestCache) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    const cachedResponse = this.cache.get(req);
    //if (req.method === 'POST' && )
    return cachedResponse ? Observable.of(cachedResponse) : this.sendRequest(req, next, this.cache);
  }

  sendRequest(
    req: HttpRequest<any>,
    next: HttpHandler,
    cache: RequestCache): Observable<HttpEvent<any>> {
      const apiReq = req.clone({ url: `${baseURL}/${req.url}` });
      return next.handle(apiReq).pipe(
        tap(event => {
          if (req.method === 'GET' && event instanceof HttpResponse) {
            cache.put(req, event);
          }
        })
      );
  }
}
