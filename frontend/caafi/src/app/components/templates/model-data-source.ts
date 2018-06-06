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
        this.processData(data, proccessedData, null, repeatSections, dates, booleans, namesRepeats);
        this.dataSubject.next(proccessedData);
        resolve(proccessedData.length);
      });
    });
  }

  processData(data, proccessedData, dataId, repeatSections, dates, booleans, namesRepeats) {
    for (const i in data) {
      if (typeof data[i] === 'object' && !repeatSections.includes(i)) {
        if (data[i] != null && data[i].id) {
          dataId = data[i].id;
        }
        this.processData(data[i], proccessedData, dataId, repeatSections, dates, booleans, namesRepeats);
        if (data[i] != null && data[i].constructor.name === 'Object' && !data[i]['data']) {
          data[i]['id'] = dataId;
          proccessedData.push(data[i]);
        }
      } else {
        if (dates.includes(i)) {
          const options: Intl.DateTimeFormatOptions = {
            year: 'numeric', month: '2-digit', day: '2-digit'
          };
          const date: Date = new Date(data[i]);
          data[i] = date.toLocaleDateString('ja-JP', options);
        } else if (booleans.includes(i)) {
          if (data[i]) {
            data[i] = 'Si';
          } else {
            data[i] = 'No';
          }
        } else if (repeatSections.includes(i)) {
          let dataRepeat = '';
          for (let j = 0; j < data[i].length; j++ ) {
            dataRepeat += '{ ';
            for (const k in data[i][j]) {
              if (typeof data[i][j][k] === 'object') {
                dataRepeat += namesRepeats[k] + ': ' + data[i][j][k].toString() + ', ';
              } else {
                dataRepeat += namesRepeats[k] + ': ' + data[i][j][k] + ', ';
              }
            }
            dataRepeat = dataRepeat.slice(0, -2) + ' }, <br><br>';
          }
          data[i] = dataRepeat.slice(0, -10);
        }
      }
    }
  }
}
