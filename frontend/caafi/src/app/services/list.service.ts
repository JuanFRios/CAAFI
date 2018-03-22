import { Injectable } from '@angular/core';
import { of } from 'rxjs/observable/of';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { ConfigService } from './config.service';
import { Config } from '../common/config';

@Injectable()
export class ListService {
    sports = [
        {
            "label" : "Dedicación exclusiva",
            "value" : "Dedicación exclusiva"
        },
        {
            "label" : "Otros",
            "value" : "Otros"
        }
    ];

    constructor(
      private configService: ConfigService
    ) { }

    getList(listName): Observable<Subscription>{
        return of(this.configService.getByName(listName).subscribe(confi => { return confi }))
    }
}
