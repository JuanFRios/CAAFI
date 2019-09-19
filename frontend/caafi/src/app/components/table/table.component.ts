import { Component, OnInit, ViewChild, Input, AfterViewInit, ElementRef } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { ModelDataSource } from './model-data-source';
import { tap, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { merge } from 'rxjs/internal/observable/merge';
import { fromEvent } from 'rxjs';
import { Router } from '@angular/router';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent implements OnInit, AfterViewInit {

  @Input() collection: string;
  @Input() columns: object;

  tableName = null;
  dataSource: ModelDataSource;
  columnsList: string[];
  displayedColumns: string[];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('input') input: ElementRef;

  dataCount = 1;

  constructor(
    private dataService: DataService,
    private router: Router
  ) { }

  ngOnInit() {
    this.displayedColumns = Object.keys(this.columns);
    this.dataService.countAllByCollection(this.collection).subscribe(length => {
      this.dataCount = +length;
    });
    this.dataSource = new ModelDataSource(this.dataService);
    this.dataSource.loadData(this.collection);
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
      this.paginator.pageSize);
  }

  onRowClicked(row: any) {
    console.log('Row clicked: ', row);
    this.router.navigate(['convocatorias/convocatoria/', row._Id]);
  }

}
