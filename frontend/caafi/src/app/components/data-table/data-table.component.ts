import { OnInit, Component, Input, ViewChild, ElementRef, Output, EventEmitter, OnDestroy } from '@angular/core';
import { ModelDataSource } from './model-data-source';
import { DataService } from '../../services/data.service';
import { NotifierService } from 'angular-notifier';
import { Data } from '../../common/data';
import { MatSort, MatPaginator } from '@angular/material';
import { Subscription } from 'rxjs/Subscription';
import { merge } from 'rxjs/observable/merge';
import { tap, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { fromEvent } from 'rxjs/observable/fromEvent';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Component({
  selector: 'app-data-table',
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.css']
})
export class DataTableComponent implements OnInit, OnDestroy {

  @Input() formId: string;
  @Input() dependencyName: string;
  @Input() allDataAccess: boolean;
  @Output() copyData = new EventEmitter();
  @Output() editData = new EventEmitter();
  @Output() deleteData = new EventEmitter();
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild('filter') filter: ElementRef;

  private _template = new BehaviorSubject<any>([]);
  @Input()
    set template(value) {
        this._template.next(value);
    }

    get template() {
        return this._template.getValue();
    }

  private readonly notifier: NotifierService;
  dataSource: ModelDataSource;
  model: Data;
  sortChange: Subscription;
  tapPaginator: Subscription;
  filterEvent: Subscription;
  filters: string;

  constructor(
    private dataService: DataService,
  ) {}

  ngOnInit() {
    this._template
      .subscribe(x => {
        this.loadDataTable();
      });
  }

  loadDataTable() {
    this.dataSource = new ModelDataSource(this.dataService);

    const urlFilters = encodeURIComponent(JSON.stringify({}));

    this.countData(urlFilters).then(result => {
      this.dataSource.loadData(this.formId, this.dependencyName, this.allDataAccess,
        '', 'savedDate', 'desc', 0, 5, this.template.repeatSections, this.template.dates,
        this.template.booleans, this.template.files, this.template.namesRepeats, urlFilters).then(loadResult => {
          if (this.sortChange) {
            this.sortChange.unsubscribe();
          }
          this.sortChange = this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);

          if (this.tapPaginator) {
            this.tapPaginator.unsubscribe();
          }

          this.paginator.pageIndex = 0;
          this.tapPaginator = merge(this.sort.sortChange, this.paginator.page)
            .pipe(
              tap(() => this.loadDataPage())
            )
            .subscribe();

          // server-side search
          if (this.filterEvent) {
            this.filterEvent.unsubscribe();
          }
          this.filterEvent = fromEvent(this.filter.nativeElement, 'keyup')
            .pipe(
              debounceTime(150),
              distinctUntilChanged(),
              tap(() => {
                this.paginator.pageIndex = 0;
                this.loadDataPage();
              })
            )
            .subscribe();
        });
    });
  }

  countData(urlFilters) {
    return new Promise(resolve => {
      this.dataService.count(this.formId, this.dependencyName, this.allDataAccess, '', urlFilters)
      .subscribe(countData => {
        this.model = countData;
        resolve();
      },
      error => {
        this.notifier.notify( 'error', 'ERROR: Error al cargar los datos del formulario.' );
      });
    });
  }

  loadDataPage() {

    this.dataService.count(this.formId, this.dependencyName, this.allDataAccess,
      this.filter.nativeElement.value, this.filters)
      .subscribe(countData => {
        this.model = countData;
      },
      error => {
        this.notifier.notify( 'error', 'ERROR: Error al cargar los datos del formulario.' );
      });

    this.dataSource.loadData(this.formId, this.dependencyName, this.allDataAccess,
      this.filter.nativeElement.value, this.getSortColumn(), this.sort.direction, this.paginator.pageIndex,
      this.paginator.pageSize, this.template.repeatSections, this.template.dates, this.template.booleans,
      this.template.files, this.template.namesRepeats, this.filters);
  }

  getSortColumn() {
    let sortColumn = 'savedDate';
    if (this.sort.active != null && this.sort.active.length > 0
      && this.sort.direction != null && this.sort.direction.length > 0) {
      sortColumn = 'data.' + this.sort.active;
    }
    return sortColumn;
  }

  refresh($event) {
    this.loadDataTable();
  }

  onCopyData(id) {
    this.copyData.emit(id);
  }

  onEditData(id) {
    this.editData.emit(id);
  }

  onDeleteData(id) {
    this.deleteData.emit(id);
  }

  ngOnDestroy() {
    this._template.unsubscribe();
  }

}
