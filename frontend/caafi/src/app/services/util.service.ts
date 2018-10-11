import { Injectable } from '@angular/core';

@Injectable()
export class UtilService {

  constructor() {}

  arrayContains(needle, arrhaystack) {
    return (arrhaystack.indexOf(needle) > -1);
  }

}
