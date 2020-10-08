import { OnInit, Inject, Component } from '@angular/core';
import { ComponentType } from '@angular/cdk/portal';
import { CreateComponent } from './create/create.component';
import { UpdateComponent } from './update/update.component';
import { TableItem } from 'src/app/model/resource/table/table-item';
import { TableComponent } from '../table.component';
import { DATA_INTERFACE, DataInterface } from 'src/app/service/data.interface';
import { TableService } from 'src/app/service/table.service';
import { SnackbarComponent } from 'src/app/snackbar/snackbar.component';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from 'src/app/dialog/dialog.component';
import { saveAs } from 'file-saver';

@Component({
  template: `EMPTY`
})
export abstract class DataTableComponent<T extends TableItem> extends TableComponent<T> implements OnInit {

  public componentCreate: ComponentType<any>;
  public componentUpdate: ComponentType<any>;

  constructor(
    @Inject(DATA_INTERFACE) public service: DataInterface<T>,
    public tableService: TableService,
    public snackBar: SnackbarComponent,
    public dialog: MatDialog
  ) {
    super(tableService, service);
    this.componentCreate = CreateComponent;
    this.componentUpdate = UpdateComponent;
  }

  ngOnInit(): void {
    super.ngOnInit();
  }

  public crear(): void {
    const dialogRef = this.dialog.open(this.componentCreate, {
      id: 'createDialog',
      width: '1140px',
      maxWidth: '90vw',
      height: 'auto',
      panelClass: 'dialog-wrapper',
    });
    dialogRef.componentInstance.service = this.service;
    dialogRef.componentInstance.formId = this.createFormId;
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.refresh();
      }
    });
  }

  public editar(id?: string): void {
    const dialogRef = this.dialog.open(this.componentUpdate, {
      id: 'editDialog',
      width: '1140px',
      maxWidth: '90vw',
      height: 'auto',
      panelClass: 'dialog-wrapper'
    });
    dialogRef.componentInstance.service = this.service;
    dialogRef.componentInstance.formId = this.updateFormId;
    dialogRef.componentInstance.id = id ? id : this.selection.selected[0].id;
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.refresh();
      }
    });
  }

  public eliminar(): void {
    const dialogRef = this.dialog.open(DialogComponent);
    dialogRef.componentInstance.dc = {
      contentHtml: '¿Desea eliminar el registro permanentemente?',
      cancelButtonText: 'NO',
      okButtonText: 'SI'
    };
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.service.delete(this.selection.selected[0].id).subscribe(response => {
          if (response) {
            this.snackBar.snackbarSuccess('Registro eliminado satisfactoriamente');
            this.refresh();
          }
        }, () => {
          this.snackBar.snackbarError('Ocurrio un error por favor intentelo nuevamente');
        });
      }
    });
  }

  public descargar() {
    this.service.download(
      this.sort.active,
      this.sort.direction,
      this.filterInput.nativeElement.value,
      this.tableDataSource.filterFields
    ).subscribe(data => {
      const blob = new Blob([data], { type: 'application/vnd.ms-excel' });
      const file = new File([blob], 'objects.xlsx', { type: 'application/vnd.ms-excel' });
      saveAs(file);
    }, () => {
      this.snackBar.snackbarError("Error descargando el archivo");
    });
  }

  public abstract get createFormId(): string;

  public abstract get updateFormId(): string;

}
