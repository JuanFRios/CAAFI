import { Component } from '@angular/core';
import { FormlyFieldInput } from '@ngx-formly/material';
import {MAT_MOMENT_DATE_FORMATS, MomentDateAdapter} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';

@Component({
  selector: 'app-form-datepicker-type',
  templateUrl: './datepicker.component.html',
  providers: [
    {provide: MAT_DATE_LOCALE, useValue: 'es-CO'},
    {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
    {provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS},
  ]
})
export class DatepickerTypeComponent extends FormlyFieldInput { }
