import { OnInit, Component, Input, ViewChild, ElementRef, Output, EventEmitter, OnDestroy } from '@angular/core';
import { ModelDataSource } from './model-data-source';
import { DataService } from '../../services/data.service';
import { NotifierService } from 'angular-notifier';
import { Data } from '../../common/data';
import { MatSort, MatPaginator } from '@angular/material';
import { Subscription ,  merge ,  fromEvent ,  BehaviorSubject } from 'rxjs';
import { tap, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { ExportToCsv } from 'export-to-csv';
import { ExcelService } from '../../services/excel.service';

@Component({
  selector: 'app-data-table',
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.css']
})
export class DataTableComponent implements OnInit, OnDestroy {

  @Input() formId: string;
  @Input() dependencyName: string;
  @Input() allDataAccess = false;
  @Input() activeActions = true;
  @Input() export = false;
  @Output() copyData = new EventEmitter();
  @Output() editData = new EventEmitter();
  @Output() deleteData = new EventEmitter();
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild('filter') filter: ElementRef;

  @Input() exportCSVSpinnerButtonOptions: any = {
    active: false,
    text: 'Exportar',
    spinnerSize: 18,
    raised: true,
    buttonColor: 'primary',
    spinnerColor: 'primary',
    disabled: false
  };
  @Input() refreshSpinnerButtonOptions: any = {
    active: false,
    text: 'Refrescar',
    spinnerSize: 18,
    raised: true,
    buttonColor: 'primary',
    spinnerColor: 'primary'
  };

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
    private excelService: ExcelService,
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
    this.exportCSVSpinnerButtonOptions.active = true;
    this.loadDataTable();
    this.exportCSVSpinnerButtonOptions.active = false;
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

  filterData(filterFormData) {
    const urlFilters = encodeURIComponent(JSON.stringify(filterFormData));
    this.filters = urlFilters;
    this.dataService.count(this.formId, this.dependencyName, this.allDataAccess,
      this.filter.nativeElement.value, urlFilters)
    .subscribe(countData => {
      this.model = countData;
    },
    error => {
      this.notifier.notify( 'error', 'ERROR: Error al cargar los datos del formulario.' );
    });

    this.paginator.pageIndex = 0;
    this.dataSource.loadData(this.formId, this.dependencyName, this.allDataAccess,
      this.filter.nativeElement.value, this.getSortColumn(), this.sort.direction, this.paginator.pageIndex,
      this.paginator.pageSize, this.template.repeatSections, this.template.dates, this.template.booleans,
      this.template.files, this.template.namesRepeats, this.filters);
  }

  exportCSV() {

    this.exportCSVSpinnerButtonOptions.active = true;
    this.exportCSVSpinnerButtonOptions.text = 'Cargando Reporte...';

    this.dataService.getAllByTemplateAndDependency(this.formId, this.dependencyName,
      this.allDataAccess, this.filter.nativeElement.value, this.getSortColumn(),
      this.sort.direction, 0, -1, this.filters)
      .subscribe(data => {
        const proccessedData: Object[] = [];
        this.dataService.processDataReport(data, [], proccessedData, null, this.template.repeatSections,
          this.template.dates, this.template.booleans, this.template.files, this.template.namesRepeats,
          this.template.displayedColumnsNames);
          this.excelService.exportAsExcelFile(proccessedData, 'reporte-' + this.dependencyName + '-' + this.formId, this.formId);
          this.exportCSVSpinnerButtonOptions.active = false;
          this.exportCSVSpinnerButtonOptions.text = 'Exportar';
      });
  }

  disableExportButon(numberData) {
    if (numberData <= 0) {
      this.exportCSVSpinnerButtonOptions.disabled = true;
    } else {
      this.exportCSVSpinnerButtonOptions.disabled = false;
    }
  }

  ngOnDestroy() {
    this._template.unsubscribe();
  }

}
