import { Injectable } from '@angular/core';
import { of } from 'rxjs/observable/of';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { ConfigService } from './config.service';
import { Config } from '../common/config';
import { from } from 'rxjs/observable/from';

@Injectable()
export class ListService {

    constructor(
      private configService: ConfigService
    ) { }

    getList(listName): Observable<any[]> {
        return from(this.getListFromDB(listName));
    }

    getListFromDB(listName): Promise<any[]> {
        return new Promise(resolve => {
            this.configService.getByName(listName).subscribe(confi => {
                resolve(eval(JSON.stringify(confi.value)));
            });
        });
    }
}
