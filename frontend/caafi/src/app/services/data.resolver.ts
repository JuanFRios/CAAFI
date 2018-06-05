import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Data } from '../common/data';
import { DataService } from './data.service';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class DataResolver implements Resolve<Data> {

    constructor(private dataService: DataService) {

    }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Data> {
        console.log('route', route);
        return this.dataService.count('', '');
    }

}
