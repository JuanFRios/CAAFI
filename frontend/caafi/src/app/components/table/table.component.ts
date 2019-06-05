import { OnInit, Component, Input, ViewChild, ElementRef, Output, EventEmitter, OnDestroy } from '@angular/core';
import { ModelSource } from './model-source';
import { DataService } from '../../services/data.service';
import { NotifierService } from 'angular-notifier';
import { Data } from '../../common/data';
import { MatSort, MatPaginator } from '@angular/material';
import { Subscription ,  merge ,  fromEvent ,  BehaviorSubject } from 'rxjs';
import { tap, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { ExportToCsv } from 'export-to-csv';
import { ExcelService } from '../../services/excel.service';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent implements OnInit {

  @Input() collection = null;
  @Input() columns = null;
  @Input() export = false;
  @Input() filters: string;
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

  private readonly notifier: NotifierService;
  dataSource: ModelSource;
  model: Data;
  sortChange: Subscription;
  tapPaginator: Subscription;
  filterEvent: Subscription;
  extFilter: string;
  data = null;
  displayedColumns: string[] = ['cedula'];

  constructor(
    private dataService: DataService,
    private excelService: ExcelService,
  ) {}

  ngOnInit() {
    this.loadColumns();
    this.loadDataTable();
  }

  loadColumns() {

  }

  loadDataTable() {
    this.dataSource = new ModelSource(this.dataService);

    this.dataSource.loadData(this.collection).then(result => {
      this.data = result;
      console.log(result);
    });

    /*
    .then(loadResult => {
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
    */
  }

  /*
  countData(urlFilters) {
    return new Promise(resolve => {
      let filter = '';
      if (this.extFilter != null) {
        filter = this.extFilter;
      }
      this.dataService.count(this.formId, this.dependencyName, this.allDataAccess, filter, urlFilters)
      .subscribe(countData => {
        this.model = countData;
        resolve();
      },
      error => {
        this.notifier.notify( 'error', 'ERROR: Error al cargar los datos del formulario.' );
      });
    });
  }
  */

  /*
  loadDataPage() {

    let filter = '';
    if (this.extFilter != null && this.filter != null) {
      filter = this.extFilter + ';' + this.filter.nativeElement.value;
    } else if (this.extFilter != null) {
      filter = this.extFilter;
    } else if (this.filter != null) {
      filter = this.filter.nativeElement.value;
    } else {
      filter = '';
    }

    this.dataService.count(this.formId, this.dependencyName, this.allDataAccess,
      filter, this.filters)
      .subscribe(countData => {
        this.model = countData;
      },
      error => {
        this.notifier.notify( 'error', 'ERROR: Error al cargar los datos del formulario.' );
      });

    this.dataSource.loadData(this.formId, this.dependencyName, this.allDataAccess,
    filter, this.getSortColumn(), this.sort.direction, this.paginator.pageIndex,
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
          this.excelService.exportAsExcelFile(proccessedData,
            'reporte-' + this.dependencyName + '-' + this.formId, this.formId);
          this.exportCSVSpinnerButtonOptions.active = false;
          this.exportCSVSpinnerButtonOptions.text = 'Exportar';
      });
  }

  externalExportReport() {
    return new Promise(resolve => {
      const proccessedData: Object[] = [];
      this.dataService.getAllByTemplateAndDependency(this.formId, this.dependencyName,
        this.allDataAccess, this.extFilter, 'savedDate', '', 0, -1, this.filters)
        .subscribe(data => {
          this.dataService.processDataReport(data, [], proccessedData, null, this.template.repeatSections,
            this.template.dates, this.template.booleans, this.template.files, this.template.namesRepeats,
            this.template.displayedColumnsNames);
            resolve(proccessedData);
        });
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
  */

}
