import { Component, OnInit, Inject, Input, ViewChild, ElementRef } from '@angular/core';
import { TemplatesService } from '../../services/templates.service';
import { DataService } from '../../services/data.service';
import { Template } from '../../common/template';
import { FormGroup } from '@angular/forms';
import { FormlyFieldConfig } from '@ngx-formly/core';

@Component({
  selector: 'app-templates',
  templateUrl: './templates.component.html',
  styleUrls: ['./templates.component.css']
})
export class TemplatesComponent implements OnInit {

  errorMessage: string;
  form: FormGroup;
  formFields: Array<FormlyFieldConfig>;
  formData: Object;

  constructor(
    private templatesService: TemplatesService,
    private dataService: DataService
  ) {
    this.loadForm();
  }

  ngOnInit() {}

  loadForm() {
    this.form = new FormGroup({});
    this.templatesService.getByName("3")
      .subscribe(form => {
        this.formData = new Object();

        this.proccessValidators(form.fields);
        this.formFields = form.fields;
      },
      error => this.errorMessage = error);
  }

  proccessValidators(fields) {
    for(var i = 0; i < fields.length; i++) {
      if(fields[i].validators != undefined) {
        for(var validator in fields[i].validators) {
          fields[i].validators[validator] = eval(fields[i].validators[validator]);
        }
      }
    }
  }

  onSubmit(template) {
    console.log(template);
  }

  loadData() {
    this.dataService.getById(1)
      .subscribe(formData => {
        this.formData = formData.data;
      },
      error => this.errorMessage = error);
  }

}
