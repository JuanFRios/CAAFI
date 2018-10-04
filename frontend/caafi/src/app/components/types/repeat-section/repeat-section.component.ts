import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';
import { FieldType, FormlyFormBuilder } from '@ngx-formly/core';
import { Subject } from 'rxjs/Subject';
import { takeUntil, startWith, tap } from 'rxjs/operators';
import * as clonedeep from 'lodash.clonedeep';

@Component({
  selector: 'app-formly-repeat-section',
  templateUrl: './repeat-section.component.html'
})
export class RepeatTypeComponent extends FieldType implements OnInit, OnDestroy, AfterViewInit {
  formControl: FormArray;
  field: any;
  fields = [];
  onDestroy$ = new Subject<void>();

  constructor(private builder: FormlyFormBuilder) {
    super();
  }

  get newFields() {
    return clonedeep(this.field.fieldArray.fieldGroup);
  }

  ngOnInit() {
    if (this.model != null && this.model.length > 0) {
      setTimeout(() => this.model.map(() => this.add()));
    }
  }

  ngAfterViewInit() {
    setTimeout(this.add(), 10000);
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

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }
}
