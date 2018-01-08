import { Component, OnInit, OnDestroy, Inject, Input, ViewChild, ElementRef } from '@angular/core';
import { TemplatesService } from '../../services/templates.service';
import { DataService } from '../../services/data.service';
import { Template } from '../../common/template';
import { Data } from '../../common/data';
import { FormGroup } from '@angular/forms';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-templates',
  templateUrl: './templates.component.html',
  styleUrls: ['./templates.component.css']
})
export class TemplatesComponent implements OnInit {

  id: string;
  private sub: any;
  errorMessage: string[] = [];
  exito: boolean = false;
  cargando: boolean = false;
  form: FormGroup;
  formFields: Array<FormlyFieldConfig>;
  formData: Object;
  private data: Data;

  constructor(
    private templatesService: TemplatesService,
    private dataService: DataService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
       this.id = params['id'];

       this.loadForm();
    });
  }

  loadForm() {
    this.form = new FormGroup({});
    this.templatesService.getByName(this.id)
      .subscribe(form => {
        this.formData = new Object();

        this.proccessValidators(form.fields);
        this.formFields = form.fields;
      },
      error => this.errorMessage.push(error));
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
    this.errorMessage = [];
    this.exito = false;
    this.cargando = true;

    this.data = new Data();
    this.data.data = template;
    console.log(this.data);
    this.dataService.save(this.data)
      .subscribe(res => {
        this.exito = true;
        this.cargando = false;
      },
      error => this.errorMessage.push(error));
  }

  loadData() {
    this.dataService.getById(1)
      .subscribe(formData => {
        this.formData = formData.data;
      },
      error => this.errorMessage = error);
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

}
