import { Injectable } from '@angular/core';
import { HttpRequest, HttpResponse } from '@angular/common/http';

const maxAge = 3600000; // one hour in milliseconds
@Injectable()
export class RequestCache  {

  noCacheUrls = [
    'account/check',
    'account/login',
    'account/logout'
  ];

  get(req: HttpRequest<any>): HttpResponse<any> | undefined {
    const url = req.urlWithParams;
    const cached = this.getObjectFromString(localStorage.getItem(url));

    if (!cached) {
      return undefined;
    }

    const isExpired = cached.lastRead < (Date.now() - maxAge);
    if (isExpired) {
      localStorage.removeItem(cached.url);
      return undefined;
    }
    return new HttpResponse<any>(cached.response);
  }

  getObjectFromString(value: string): any | undefined {
    if (value) {
      return JSON.parse(value);
    }
    return undefined;
  }

  put(req: HttpRequest<any>, response: HttpResponse<any>): void {
    const url = req.url;
    if (!this.noCacheUrls.includes(url)) {
      const entry = { url, response, lastRead: Date.now() };
      localStorage.setItem(url, JSON.stringify(entry));
      console.log(localStorage);
    }
  }
}
