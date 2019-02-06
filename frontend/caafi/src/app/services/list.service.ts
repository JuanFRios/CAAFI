import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { ConfigService } from './config.service';
import { from } from 'rxjs/observable/from';

@Injectable()
export class ListService {

    constructor(
      private configService: ConfigService
    ) { }

    getList(listName, isPublic = false): Observable<any[]> {
        return from(this.getListFromDB(listName, isPublic));
    }

    getListFromDB(listName, isPublic = false): Promise<any[]> {
        return new Promise(resolve => {
            if (!isPublic) {
                this.configService.getByName(listName).subscribe(confi => {
                    resolve(eval(JSON.stringify(confi.value)));
                });
            } else {
                this.configService.getPublicConfigByName(listName).subscribe(confi => {
                    resolve(eval(JSON.stringify(confi.value)));
                });
            }
        });
    }
}
