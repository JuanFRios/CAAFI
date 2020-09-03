import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { ModalFormComponent } from 'src/app/form/modal-form/modal-form.component';
import { NgForm } from '@angular/forms';
import { SnackbarComponent } from 'src/app/snackbar/snackbar.component';
import { FormService } from 'src/app/service/form.service';
import { MatDialog } from '@angular/material/dialog';
import { CRUDInterface } from 'src/app/service/crud.interface';

@Component({
  selector: 'app-update',
  templateUrl: '../../../form/modal-form/modal-form.component.html',
  styleUrls: ['../../../form/modal-form/modal-form.component.scss']
})
export class UpdateComponent extends ModalFormComponent implements OnInit {

  @ViewChild('myForm') myForm: NgForm;
  public id: string;
  public formId: string;
  public service: CRUDInterface<any>;

  constructor(
    private snackBar: SnackbarComponent,
    public formService: FormService,
    private dialog: MatDialog
  ) {
    super(formService);
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.service.findById(this.id).subscribe((response: any) => {
      this.model = response;
    });
  }

  public submit(): void {
    this.form.markAsTouched();
    (this.myForm as any).submitted = true;
    if (this.form.valid) {
      this.service.update(this.model).subscribe(() => {
        this.snackBar.snackbarSuccess('Registro actualizado satisfactoriamente');
        this.dialog.getDialogById('editDialog').close(true);
      }, () => {
        this.snackBar.snackbarError('Ocurrio un error por favor intentelo nuevamente');
      });
    } else {
      this.snackBar.snackbarError('Formulario con errores por favor verifica');
    }
  }

}
