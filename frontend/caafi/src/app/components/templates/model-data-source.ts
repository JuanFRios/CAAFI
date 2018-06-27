import {CollectionViewer, DataSource} from '@angular/cdk/collections';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { DataService } from '../../services/data.service';
import { Observable } from 'rxjs/Observable';
import { catchError } from 'rxjs/operators/catchError';
import { of } from 'rxjs/observable/of';
import { finalize } from 'rxjs/operators/finalize';

export class ModelDataSource extends DataSource<Object> {

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

  loadData(template: string, dependency: string, allDataAccess: boolean, filter = '', sortColumn = '',
              sortDirection = 'asc', pageIndex = 0, pageSize = 5,
              repeatSections, dates, booleans, files, namesRepeats, filters) {
    this.loadingSubject.next(true);

    return new Promise( resolve => {
      this.dataService.getAllByTemplateAndDependency(template, dependency, allDataAccess, filter, sortColumn,
        sortDirection, pageIndex, pageSize, filters).pipe(
        catchError(() => of([])),
        finalize(() => this.loadingSubject.next(false))
      )
      .subscribe(data => {
        const proccessedData: Object[] = [];
        this.dataService.processData(data, proccessedData, null, repeatSections, dates, booleans, files, namesRepeats);
        this.dataSubject.next(proccessedData);
        resolve(proccessedData);
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
