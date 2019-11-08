import { Component, OnInit, ViewChild, Input, AfterViewInit, ElementRef } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { ModelDataSource } from './model-data-source';
import { tap, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { merge } from 'rxjs/internal/observable/merge';
import { fromEvent } from 'rxjs';
import { Router } from '@angular/router';
import { DataService } from '../../services/data.service';
import { MatProgressButtonOptions } from 'mat-progress-buttons';
import { ExportToCsv } from 'export-to-csv';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent implements OnInit, AfterViewInit {

  @Input() collection: string;
  @Input() columns: object;
  @Input() export: boolean;
  @Input() tableFilters: object;

  tableName = null;
  dataSource: ModelDataSource;
  columnsList: string[];
  displayedColumns: string[];
  filters: object = {};
  dataCount = 1;
  btnExportOpts: MatProgressButtonOptions;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('input') input: ElementRef;

  constructor(
    private dataService: DataService,
    private router: Router
  ) { }

  ngOnInit() {
    this.btnExportOpts = {
      active: false,
      text: 'Exportar',
      spinnerSize: 19,
      raised: true,
      stroked: false,
      buttonColor: 'primary',
      spinnerColor: 'primary',
      fullWidth: false,
      disabled: !this.export,
      mode: 'indeterminate',
    };

    this.displayedColumns = Object.keys(this.columns);
    this.dataSource = new ModelDataSource(this.dataService);
    this.filters = this.tableFilters;
    this.loadDataPage();
  }

  ngAfterViewInit() {

    // server-side search
    fromEvent(this.input.nativeElement, 'keyup')
      .pipe(
        debounceTime(150),
        distinctUntilChanged(),
        tap(() => {
          this.paginator.pageIndex = 0;
          this.loadDataPage();
        })
      )
      .subscribe();

    // reset the paginator after sorting
    this.sort.sortChange.subscribe(() => {
      this.paginator.pageIndex = 0;
    });

    // on sort or paginate events, load a new page
    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        tap(() => this.loadDataPage())
      )
      .subscribe();
  }

  loadDataPage() {
    this.dataSource.loadData(
      this.collection,
      this.input.nativeElement.value,
      this.sort.active,
      this.sort.active ? this.sort.direction : 'desc',
      this.paginator.pageIndex,
      this.paginator.pageSize,
      this.filters);

    this.dataSource.countData(
      this.collection,
      this.input.nativeElement.value,
      this.filters
    ).then(length => {
      this.dataCount = +length;
    });
  }

  applyFilters(filters): Promise<any> {
    return new Promise(resolve => {
      this.filters = {...this.tableFilters, ...filters};
      this.loadDataPage();
      resolve();
    });
  }

  exportCSV() {
    console.log('export');

    const options = {
      fieldSeparator: ',',
      quoteStrings: '"',
      decimalSeparator: '.',
      showLabels: true,
      showTitle: true,
      title: this.collection,
      useTextFile: false,
      useBom: true,
      useKeysAsHeaders: true
    };

    const csvExporter = new ExportToCsv(options);

    this.dataSource.loadReport(
      this.collection,
      this.input.nativeElement.value,
      this.sort.active,
      this.sort.active ? this.sort.direction : 'desc',
      this.paginator.pageIndex,
      -1,
      this.filters).then(data => {
        csvExporter.generateCsv(data);
      });
  }

}
