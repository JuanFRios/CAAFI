import {CollectionViewer, DataSource} from '@angular/cdk/collections';
import { BehaviorSubject ,  Observable ,  of } from 'rxjs';
import { catchError ,  finalize } from 'rxjs/operators';
import { DataService } from '../../services/data.service';

export class ModelDataSource implements DataSource<any> {

  private dataSubject = new BehaviorSubject<any[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);

  public loading$ = this.loadingSubject.asObservable();

  constructor(
    private dataService: DataService
  ) {}

  connect(collectionViewer: CollectionViewer): Observable<any[]> {
    return this.dataSubject.asObservable();
  }

  disconnect(collectionViewer: CollectionViewer): void {
    this.dataSubject.complete();
    this.loadingSubject.complete();
  }

  loadData(collection: string, filter = '', sortColumn = 'savedDate', sortDirection = 'desc', pageIndex = 0, pageSize = 5) {
    this.loadingSubject.next(true);

    return new Promise( resolve => {
      this.dataService.getByCollection(collection, filter, sortColumn, sortDirection, pageIndex, pageSize).pipe(
        catchError(() => of([])),
        finalize(() => this.loadingSubject.next(false))
      ).subscribe(data => {
        this.dataSubject.next(data);
        resolve(data);
      });
    });
  }

  loading(state: boolean) {
    this.loadingSubject.next(state);
  }

}
