import {CollectionViewer, DataSource} from '@angular/cdk/collections';
import { BehaviorSubject ,  Observable ,  of } from 'rxjs';
import { DataService } from '../../services/data.service';
import { catchError ,  finalize } from 'rxjs/operators';

export class ModelSource extends DataSource<Object> {

  private dataSubject = new BehaviorSubject<Object[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);

  public loading$ = this.loadingSubject.asObservable();

  constructor(private dataService: DataService) {
    super();
  }

  connect(collectionViewer: CollectionViewer): Observable<Object[]> {
    return this.dataSubject.asObservable();
  }

  disconnect(collectionViewer: CollectionViewer): void {
    this.dataSubject.complete();
    this.loadingSubject.complete();
  }

  loadData(collection, sortColumn = 'savedDate', sortDirection = 'desc', pageIndex = 0, pageSize = 5, filters = '{}') {
    this.loadingSubject.next(true);

    return new Promise( resolve => {
      this.dataService.getAllByCollection(collection, sortColumn, sortDirection, pageIndex, pageSize,
        encodeURIComponent(JSON.stringify(filters))).pipe(
        catchError(() => of([])),
        finalize(() => this.loadingSubject.next(false))
      )
      .subscribe(data => {
        const dataArray = new Array();
        for (let i = 0; i < data.length; i++) {
          dataArray.push(data[i]);
        }
        this.dataSubject.next(dataArray);
        resolve(dataArray);
      });
    });
  }

  loading(state: boolean) {
    this.loadingSubject.next(state);
  }

  objToSearchParams(obj): URLSearchParams {
    const params: URLSearchParams = new URLSearchParams();
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        params.set(key, obj[key]);
      }
    }
    return params;
 }

}
