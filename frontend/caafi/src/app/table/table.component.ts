import { OnInit, ViewChild, ElementRef, Inject, Component } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { TableDataSource } from './table.datasource';
import { SelectionModel } from '@angular/cdk/collections';
import { fromEvent } from 'rxjs';
import { debounceTime, distinctUntilChanged, tap } from 'rxjs/operators';
import { Table } from '../model/resource/table/table';
import { TableItem } from '../model/resource/table/table-item';
import { TableInterface, TABLE_INTERFACE } from '../service/table.interface';
import { TableService } from '../service/table.service';

@Component({
  template: `EMPTY`
})
export abstract class TableComponent<T extends TableItem> implements OnInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild('filterInput') filterInput: ElementRef;
  @ViewChild(MatSort) sort: MatSort;

  public table: Table;
  public tableDataSource: TableDataSource<T>;
  public initialSelection;
  public allowMultiSelect: boolean;
  public selection: SelectionModel<T>;
  public promises: Promise<void>[];
  public loading: boolean;

  constructor(
    public tableService: TableService,
    @Inject(TABLE_INTERFACE) public service: TableInterface<T>
  ) {
    this.loading = true;
    this.initialSelection = [];
    this.allowMultiSelect = true;
    this.selection = new SelectionModel<T>(this.allowMultiSelect, this.initialSelection);
    this.promises = [];
  }

  public get displayedColumns(): string[] {
    return ['select'].concat(this.table.columns.filter(column => column.visible).map(column => column.key));
  }

  ngOnInit(): void {
    this.loadTable().then(() => {
      this.tableDataSource = new TableDataSource(this.service);
      this.tableDataSource.filterFields = this.table.columns.filter(column => column.filter ? true : false).map(column => column.key);
      this.tableDataSource.loadAll();
      this.loading = false;
      setTimeout(_ => this.loadControls());
    });
  }

  loadControls() {
    fromEvent(this.filterInput.nativeElement, 'keyup')
      .pipe(
        debounceTime(150),
        distinctUntilChanged(),
        tap(() => {
          this.paginator.pageIndex = 0;
          this.loadAll();
        })
      )
      .subscribe();

    this.tableDataSource.counter
      .pipe(
        tap((count) => {
          this.paginator.length = count;
        })
      )
      .subscribe();

    this.paginator.page
      .pipe(
        tap(() => this.loadAll())
      )
      .subscribe();

    this.sort.sortChange
      .pipe(
        tap(() => {
          this.paginator.pageIndex = 0;
          this.loadAll();
        })
      )
      .subscribe();
  }

  loadAll() {
    this.selection.clear();
    this.tableDataSource.loadAll(
      this.paginator.pageIndex,
      this.paginator.pageSize,
      this.sort.active,
      this.sort.direction,
      this.filterInput.nativeElement.value
    );
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.tableDataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
        this.selection.clear() :
        this.tableDataSource.data.forEach(row => this.selection.select(row));
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: any): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
  }

  public refresh(): void {
    this.loadAll();
  }

  public actionVisible(visibility: true | false | 'single' | 'multiple'): boolean {
    if (visibility === 'multiple') {
      return this.selection.selected.length >= 1;
    } else if (visibility === 'single') {
      return this.selection.selected.length === 1;
    }
    return visibility;
  }

  public loadTable(): Promise<void> {
    return new Promise<void>((resolve) => {
      this.tableService.findById(this.tableId).subscribe((formResponse: Table) => {
        this.table = formResponse;
        resolve();
      });
    });
  }

  public get emptyMessage(): string {
    return 'No hay registros';
  }

  public abstract get tableId(): string;

}
