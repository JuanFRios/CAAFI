import { OnInit, Component } from '@angular/core';
import { FormComponent } from '../form.component';
import { FormService } from 'src/app/service/form.service';
import { FormGroup } from '@angular/forms';

@Component({
  template: `EMPTY`
})
export abstract class ModalFormComponent extends FormComponent implements OnInit {

  constructor(
    public formservice: FormService
  ) {
    super(formservice);
  }

  ngOnInit(): void {
    super.ngOnInit();
  }

  cleanForm(): void {
    this.form.reset();
  }

}
