import { OnInit, Component } from '@angular/core';
import { FormComponent } from '../form.component';
import { FormService } from 'src/app/service/form.service';

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

}
