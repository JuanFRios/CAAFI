import { OnInit, Component, OnDestroy, ViewChild, ViewContainerRef, Input, ElementRef, ViewChildren, AfterViewInit, QueryList } from '@angular/core';
import { DataTableComponent } from '../data-table/data-table.component';
import { TOUCH_BUFFER_MS } from '@angular/cdk/a11y';
import { from } from 'rxjs';

@Component({
  selector: 'app-container',
  templateUrl: './container.component.html',
  styleUrls: ['./container.component.css']
})
export class ContainerComponent implements OnInit, OnDestroy {

  @Input() name: string;
  @Input() formId: string;
  @Input() dependencyId: string;
  @Input() dependencyName: string;
  @Input() allDataAccess = false;
  @Input() activeActions = true;
  @Input() export = false;
  @ViewChild('vc', {read: ViewContainerRef}) viewContainerRef: ViewContainerRef;
  private _activeDataTable: DataTableComponent;

  /*
  private activeDataTable: DataTableComponent;
  @ViewChildren('vc') set content(content: DataTableComponent) {
    this.activeDataTable = content;
  }
  */

  constructor() {}

  set activeDataTable(activeDataTable: DataTableComponent) {
    this._activeDataTable = activeDataTable;
  }

  get activeDataTable(): DataTableComponent {
    return this._activeDataTable;
  }

  ngOnInit() {}

  ngOnDestroy() {}

  exportDataTableData() {
    return from(this._activeDataTable.externalExportReport());
  }

}

