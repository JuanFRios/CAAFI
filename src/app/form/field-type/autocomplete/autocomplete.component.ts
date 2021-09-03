import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { FieldType } from '@ngx-formly/material';
import { MatInput } from '@angular/material/input';
import { MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { Observable } from 'rxjs';
import { startWith, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-autocomplete',
  templateUrl: './autocomplete.component.html',
  styleUrls: ['./autocomplete.component.scss']
})
export class AutocompleteComponent extends FieldType implements OnInit, AfterViewInit {

  @ViewChild(MatInput, { static: false }) formFieldControl: MatInput;
  @ViewChild(MatAutocompleteTrigger, { static: false }) autocomplete: MatAutocompleteTrigger;

  public filter: Observable<any>;

  constructor() {
    super();
  }

  ngOnInit() {
    super.ngOnInit();
    this.filter = this.formControl.valueChanges
      .pipe(
        startWith(''),
        switchMap(term => this.to.filter(term)),
      );
  }

  ngAfterViewInit() {
    super.ngAfterViewInit();
    // temporary fix for https://github.com/angular/material2/issues/6728
    (this.autocomplete as any)._formField = this.formField;
  }

}
