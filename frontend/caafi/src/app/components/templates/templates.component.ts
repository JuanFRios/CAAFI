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
  templateFields: Array<FormlyFieldConfig>;
  template: Template;

  constructor(private templatesService: TemplatesService) {
    this.loadForm();
  }

  ngOnInit() {}

  loadForm() {
    this.form = new FormGroup({});
    this.templatesService.getByName("2")
      .subscribe(template => {
        this.template = new Template();
        this.templateFields = template.fields;
      },
      error => this.errorMessage = error);
  }

  submit(template) {
    console.log(template);
  }

}
