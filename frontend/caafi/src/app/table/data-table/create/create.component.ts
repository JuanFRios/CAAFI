import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { ModalFormComponent } from 'src/app/form/modal-form/modal-form.component';
import { NgForm } from '@angular/forms';
import { CRUDInterface } from 'src/app/service/crud.interface';
import { SnackbarComponent } from 'src/app/snackbar/snackbar.component';
import { FormService } from 'src/app/service/form.service';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-create',
  templateUrl: '../../../form/modal-form/modal-form.component.html',
  styleUrls: ['../../../form/modal-form/modal-form.component.scss']
})
export class CreateComponent extends ModalFormComponent implements OnInit {

  @ViewChild('myForm') myForm: NgForm;
  public formId: string;
  public service: CRUDInterface<any>;

  constructor(
    public snackBar: SnackbarComponent,
    public formService: FormService,
    public dialog: MatDialog
  ) {
    super(formService);
  }

  ngOnInit(): void {
    super.ngOnInit();
  }

  public submit(): void {
    this.form.markAsTouched();
    (this.myForm as any).submitted = true;
    if (this.form.valid) {
      this.service.save(this.model).subscribe(() => {
        this.form.reset();
        (this.myForm as any).submitted = false;
        this.form.clearValidators();
        this.snackBar.snackbarSuccess('Resgitro creado satisfactoriamente');
        this.dialog.getDialogById('createDialog').close(true);
      }, error => {
        this.snackBar.snackbarError('Ocurrio un error por favor intentelo nuevamente');
      });
    } else {
      this.snackBar.snackbarError('Formulario con errores por favor verifica');
    }
  }

}
