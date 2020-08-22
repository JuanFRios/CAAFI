import { Component, OnInit, Input } from '@angular/core';
import { DataTableComponent } from '../table/data-table/data-table.component';
import { DataService } from '../service/data.service';
import { TableService } from '../service/table.service';
import { SnackbarComponent } from '../snackbar/snackbar.component';
import { MatDialog } from '@angular/material/dialog';
import { TableConfig } from '../model/resource/table/table-config';

@Component({
  selector: 'app-template-table',
  templateUrl: '../table/table.component.html',
  styleUrls: ['../table/table.component.scss']
})
export class TemplateTableComponent extends DataTableComponent<any> implements OnInit {

  @Input() tableConfig: TableConfig;

  public createFormId: string;
  public updateFormId: string;
  public tableId: string;

  constructor(
    public dataService: DataService,
    public tableService: TableService,
    public snackBar: SnackbarComponent,
    public dialog: MatDialog
  ) {
    super(dataService, tableService, snackBar, dialog);
  }

  ngOnInit(): void {
    this.dataService.template = this.tableConfig.template;
    this.dataService.dependencia = this.tableConfig.dependencia;
    this.tableId = this.tableConfig.tableId;
    this.createFormId = this.tableConfig.createFormId;
    this.updateFormId = this.tableConfig.updateFormId;
    super.ngOnInit();
  }
}
