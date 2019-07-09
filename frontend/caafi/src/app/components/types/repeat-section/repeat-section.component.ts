import { Component, OnInit, OnDestroy, AfterViewInit, OnChanges, SimpleChanges, DoCheck } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';
import { FieldType, FormlyFormBuilder, FieldArrayType } from '@ngx-formly/core';
import { Subject } from 'rxjs';
import { takeUntil, startWith, tap } from 'rxjs/operators';
import * as clonedeep from 'lodash.clonedeep';

@Component({
  selector: 'app-formly-repeat-section',
  templateUrl: './repeat-section.component.html'
})
export class RepeatTypeComponent extends FieldArrayType {}
