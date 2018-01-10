import { Component, OnInit, OnDestroy, Inject, Input, ViewChild, ElementRef } from '@angular/core';
import { TemplatesService } from '../../services/templates.service';
import { ConfigService } from '../../services/config.service';
import { DataService } from '../../services/data.service';
import { Template } from '../../common/template';
import { Dependencie } from '../../common/dependencie';
import { Data } from '../../common/data';
import { Form } from '../../common/form';
import { FormGroup, FormBuilder } from '@angular/forms';
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
  dependencies: Dependencie[];
  activeDependencie: Dependencie;
  activeForm:string;

  constructor(
    private templatesService: TemplatesService,
    private dataService: DataService,
    private route: ActivatedRoute,
    private configService: ConfigService,
  ) {}

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
       this.id = params['id'];

       this.loadConfig();
    });
  }
  loadConfig() {
	  this.form = new FormGroup({});
	    this.configService.getByName("dependencias")
	      .subscribe(form => {
	        this.dependencies = form.value;
	      },
	      error => this.errorMessage.push(error));
	  }

  loadForm(form1:Form, depent:Dependencie) {
	  this.activeDependencie = depent;
	this.form = new FormGroup({});
    this.templatesService.getByName(form1.path)
      .subscribe(form => {
    	this.activeForm=form1.name;
        this.formData = new Object();

        this.proccessFields(form.fields);
        this.formFields = form.fields;
      },
      error =>{ this.errorMessage.push(error);
      this.activeForm=null;
      });
  }

  proccessFields(fields) {

    // Proceess Validators
    this.evalValidatorsFunction(fields, "validators");
  }

  /**
   * Map to a javascript function all validators strings
   */
  evalValidatorsFunction(fields, key) {
    for (var i in fields) {
      if (i != key) {
        if(typeof fields[i] == "object") {
          this.evalValidatorsFunction(fields[i], key);
        }
      } else {
        for(var validator in fields[i]) {
          fields[i][validator] = eval(fields[i][validator]);
        }
      }
    }
  }

  onSubmit(template) {
    this.errorMessage = [];
    //this.exito = false;
    //this.cargando = true;

    this.data = new Data();
    this.data.data = template;
    console.log(this.data);

    /*
    this.dataService.save(this.data)
      .subscribe(res => {
        this.exito = true;
        this.cargando = false;
      },
      error => this.errorMessage.push(error));
      */
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
