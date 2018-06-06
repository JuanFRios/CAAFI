import {CollectionViewer, DataSource} from '@angular/cdk/collections';
import { Data } from '../../common/data';
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

  loadData(dependency: string, template: string, filter = '', sortColumn = '',
              sortDirection = 'asc', pageIndex = 0, pageSize = 5,
              repeatSections, dates, booleans, namesRepeats) {
    this.loadingSubject.next(true);

    return new Promise( resolve => {
      this.dataService.getAllByTemplateAndDependency(dependency, template, filter, sortColumn, sortDirection,
        pageIndex, pageSize).pipe(
        catchError(() => of([])),
        finalize(() => this.loadingSubject.next(false))
      )
      .subscribe(data => {
        const proccessedData: Object[] = [];
        this.dataService.processData(data, proccessedData, null, repeatSections, dates, booleans, namesRepeats);
        this.dataSubject.next(proccessedData);
        resolve(proccessedData);
      });
    });
  }
}
