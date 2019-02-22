import { Injectable } from '@angular/core';
import { Observable ,  from, ReplaySubject, Subject } from 'rxjs';
import { ConfigService } from './config.service';

@Injectable()
export class ListService {

    private dependencyList = new Subject<any[]>();
    dependencyList$ = this.dependencyList.asObservable();

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

    getListValues(list) {
        const valueList = [];
        for (let i = 0; i < list.length; i++) {
            valueList.push(list[i].value);
        }
        return valueList;
    }

    getDependencyList(): Observable<any[]> {
        return from(this.getDependencyListFromDB());
    }

    getDependencyListFromDB(): Promise<any[]> {
        return new Promise(resolve => {
            this.configService.getDependencyList().subscribe(confi => {
                this.dependencyList.next(confi.value);
                resolve(eval(JSON.stringify(confi.value)));
            });
        });
    }
}
