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

  loadData(collection: string, textFilter = '', sortColumn = 'id_plan', sortDirection = 'desc',
    pageIndex = 0, pageSize = 5, filters = {}) {
    this.loadingSubject.next(true);

    return new Promise( resolve => {
      this.dataService.getByCollection(collection, textFilter, sortColumn, sortDirection, pageIndex, pageSize, filters).pipe(
        catchError(() => of([])),
        finalize(() => this.loadingSubject.next(false))
      ).subscribe(data => {
        this.dataSubject.next(data);
        resolve(data);
      });
    });
  }

  setData(data) {
    this.dataSubject.next(data);
  }

  loadReport(collection: string, textFilter = '', sortColumn = 'id_plan', sortDirection = 'desc',
    pageIndex = 0, pageSize = 5, filters = {}) {
    this.loadingSubject.next(true);

    return new Promise( resolve => {
      this.dataService.getByCollection(collection, textFilter, sortColumn, sortDirection, pageIndex, pageSize, filters).pipe(
        catchError(() => of([])),
        finalize(() => {})
      ).subscribe(data => {
        resolve(data);
      });
    });
  }

  countData(collection: string, textFilter = '', filters = {}) {
    return new Promise( resolve => {
      this.dataService.countByCollection(collection, textFilter, filters).pipe(
        catchError(() => of([])),
        finalize(() => {})
      ).subscribe(lenght => {
        resolve(lenght);
      });
    });
  }

  loading(state: boolean) {
    this.loadingSubject.next(state);
  }

}
