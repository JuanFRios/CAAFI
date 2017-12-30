import { Component, OnInit, Inject, Input, ViewChild, ElementRef } from '@angular/core';
import { TemplatesService } from '../../services/templates.service';
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

  constructor(private templatesService: TemplatesService) {
    this.loadForm();
  }

  ngOnInit() {}

  loadForm() {
    this.form = new FormGroup({});
    this.templatesService.getByName("2")
      .subscribe(form => {
        this.formData = {}

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

}
