import { OnInit, Component, Input, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { ModelDataSource } from './model-data-source';
import { DataService } from '../../services/data.service';
import { TemplatesService } from '../../services/templates.service';
import { UtilService } from '../../services/util.service';
import { NotifierService } from 'angular-notifier';
import { Data } from '../../common/data';
import { MatSort, MatPaginator } from '@angular/material';
import { Subscription } from 'rxjs/Subscription';
import { merge } from 'rxjs/observable/merge';
import { tap, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { fromEvent } from 'rxjs/observable/fromEvent';

@Component({
  selector: 'app-data-table',
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.css']
})
export class DataTableComponent implements OnInit, AfterViewInit {

  @Input() formId: string;
  @Input() dependencyName: string;
  @Input() allDataAccess: boolean;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild('filter') filter: ElementRef;

  private readonly notifier: NotifierService;
  dataSource: ModelDataSource;
  displayedColumnsData;
  displayedColumns;
  displayedColumnsNames;
  repeatSections;
  namesRepeats;
  dates;
  booleans;
  files;
  model: Data;
  sortChange: Subscription;
  tapPaginator: Subscription;
  filterEvent: Subscription;
  filters: string;

  constructor(
    private dataService: DataService,
    private templatesService: TemplatesService,
    private utilService: UtilService
  ) {
    this.displayedColumnsData = [];
    this.displayedColumns = [];
    this.displayedColumnsNames = [];
    this.repeatSections = [];
    this.namesRepeats = {};
    this.dates = [];
    this.booleans = [];
    this.files = [];
  }

  ngOnInit() {
    this.dataSource = new ModelDataSource(this.dataService);
    this.loadDataTable();
  }

  ngAfterViewInit() {
    
  }

  loadDataTable() {

    this.loadTemplateFeatures().then(dataRetorno => {
      const urlFilters = encodeURIComponent(JSON.stringify({}));

      this.dataService.count(this.formId, this.dependencyName, this.allDataAccess, '', urlFilters)
      .subscribe(countData => {
        this.model = countData;
      },
      error => {
        this.notifier.notify( 'error', 'ERROR: Error al cargar los datos del formulario.' );
      });

      this.dataSource.loadData(this.formId, this.dependencyName, this.allDataAccess,
        '', 'savedDate', 'desc', 0, 5, this.repeatSections, this.dates, this.booleans, this.files, this.namesRepeats, urlFilters);

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
  }

  loadTemplateFeatures() {

    return new Promise( resolve => {

      this.dataSource.loading(true);

      this.displayedColumns = ['copy', 'edit', 'delete'];
      this.displayedColumnsData = [];
      this.displayedColumnsNames = [];
      this.repeatSections = [];
      this.namesRepeats = {};
      this.dates = [];
      this.booleans = [];
      this.files = [];

      this.templatesService.getByName(this.formId)
        .subscribe(form => {

          this.getTemplateFeatures(form.fields, ['key', 'type'], '');
          this.dataSource.loading(false);

          resolve();

        },
        error => {
          this.notifier.notify( 'error', 'ERROR: Error al cargar los datos del formulario.' );
        });
    });
  }

  getTemplateFeatures(fields, keys, path) {
    for (const i in fields) {
      if (typeof fields[i] === 'object') {
        this.getTemplateFeatures(fields[i], keys, path + '[\'' + i + '\']');
      } else if (this.utilService.arrayContains(i, keys)) {
        if (i === 'key' && !path.includes('fieldArray') && !path.includes('options')) {
          this.displayedColumns.push(fields[i]);
          this.displayedColumnsData.push(fields[i]);
          if (fields['type'] === 'repeat') {
            this.displayedColumnsNames[fields[i]] = fields.sectionName;
            this.repeatSections.push(fields[i]);
            for (const j of fields['fieldArray']['fieldGroup']) {
              this.namesRepeats[j.key] = j.templateOptions.label;
            }
          } else {
            this.displayedColumnsNames[fields[i]] = fields.templateOptions.label;
          }
        } else if (i === 'type' && fields[i] === 'datepicker') {
          this.dates.push(fields['key']);
        } else if (i === 'type' && fields[i] === 'checkbox') {
          this.booleans.push(fields['key']);
        } else if (i === 'type' && fields[i] === 'file') {
          this.files.push(fields['key']);
        }
      }
    }
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
      this.paginator.pageSize, this.repeatSections, this.dates, this.booleans, this.files, this.namesRepeats, this.filters);
  }

  getSortColumn() {
    let sortColumn = 'savedDate';
    if (this.sort.active != null && this.sort.active.length > 0
      && this.sort.direction != null && this.sort.direction.length > 0) {
      sortColumn = 'data.' + this.sort.active;
    }
    return sortColumn;
  }

}
