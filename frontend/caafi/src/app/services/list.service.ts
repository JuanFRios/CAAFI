import { Injectable } from '@angular/core';
import { Observable ,  from } from 'rxjs';
import { ConfigService } from './config.service';

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
