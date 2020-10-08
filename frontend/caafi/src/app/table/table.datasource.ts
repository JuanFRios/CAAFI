import { DataSource } from '@angular/cdk/table';
import { CollectionViewer } from '@angular/cdk/collections';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';
import { Page } from '../model/resource/table/page';
import { TableItem } from '../model/resource/table/table-item';
import { Inject } from '@angular/core';
import { TABLE_INTERFACE, TableInterface } from '../service/table.interface';

export class TableDataSource<T extends TableItem> implements DataSource<T> {

  private dataBehaviorSubject: BehaviorSubject<T[]>;
  private loadingBehaviorSubject: BehaviorSubject<boolean>;
  private countBehaviorSubject: BehaviorSubject<number>;
  public counter: Observable<number>;
  public filterFields: string[];

  constructor(
    @Inject(TABLE_INTERFACE) public service: TableInterface<T>
  ) {
    this.dataBehaviorSubject = new BehaviorSubject<T[]>([]);
    this.loadingBehaviorSubject = new BehaviorSubject<boolean>(false);
    this.countBehaviorSubject = new BehaviorSubject<number>(0);
    this.counter = this.countBehaviorSubject.asObservable();
  }

  public get data(): T[] {
    return this.dataBehaviorSubject.value;
  }

  public get loading(): boolean {
    return this.loadingBehaviorSubject.value;
  }

  connect(collectionViewer: CollectionViewer): Observable<T[]> {
    return this.dataBehaviorSubject.asObservable();
  }

  disconnect(collectionViewer: CollectionViewer): void {
    this.dataBehaviorSubject.complete();
    this.loadingBehaviorSubject.complete();
    this.countBehaviorSubject.complete();
  }

  loadAll(pageNumber = 0, pageSize = 10, activeColumn = 'lastModifiedDate', direction = 'desc', filter?: string) {
    this.loadingBehaviorSubject.next(true);
    this.service.findAll({
      page: pageNumber,
      size: pageSize,
      sort: direction !== '' ? [activeColumn + ',' + direction] : ['lastModifiedDate,desc'],
      filter: filter && filter.trim() !== '' ? filter : '',
      filterFields: this.filterFields
    }).pipe(
        catchError(() => of([])),
        finalize(() => this.loadingBehaviorSubject.next(false))
      )
      .subscribe((response: Page<T>) => {
        const dataResponse: Page<T> = response;
        this.dataBehaviorSubject.next(dataResponse.content.map((data: T, index) => {
          data.position = index;
          return data;
        }));
        this.countBehaviorSubject.next(dataResponse.totalElements);
      });
  }
}
