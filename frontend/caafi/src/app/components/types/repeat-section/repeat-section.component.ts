import { Component, OnInit } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';
import { FieldType, FormlyFormBuilder } from '@ngx-formly/core';
import * as clonedeep from 'lodash.clonedeep';

@Component({
  selector: 'formly-repeat-section',
  templateUrl: './repeat-section.component.html'
})
export class RepeatTypeComponent extends FieldType implements OnInit {
  formControl: FormArray;
  fields = [];

  constructor(private builder: FormlyFormBuilder) {
    super();
  }

  get newFields() {
    return clonedeep(this.field.fieldArray.fieldGroup);
  }

  ngOnInit() {
    if (this.model) {
      setTimeout(() => this.model.map(() => this.add()));
    }
  }

  add() {
    const form = new FormGroup({}),
      i = this.fields.length;

    if (!this.model[i]) {
      this.model.push({});
    }

    this.fields.push(this.newFields);
    this.builder.buildForm(form, this.fields[i], this.model[i], this.options);
    this.formControl.push(form);
  }

  remove(i) {
    this.formControl.removeAt(i);
    this.model.splice(i, 1);
    this.fields.splice(i, 1);
  }
}
