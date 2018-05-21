import { Component } from '@angular/core';
import { FormlyFieldInput, FieldType } from '@ngx-formly/material';

@Component({
  selector: 'app-form-variable-type',
  templateUrl: './variable.component.html'
})
export class VariableTypeComponent extends FieldType {
  field: any;
}
