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
import { MatSidenav } from '@angular/material';
import { MatSidenavModule } from '@angular/material';


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
  dependencieforms:Form[];
  activeForm:string;
  @ViewChild('sidenav') sidenav: MatSidenav;

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
  
  loadForm(form1:Form) {
	
	this.form = new FormGroup({});
    this.templatesService.getByName(form1.path)
      .subscribe(form => {
    	this.activeForm=form1.name;
        this.formData = new Object();

        this.proccessValidators(form.fields);
        this.formFields = form.fields;
      },
      error =>{ this.errorMessage.push(error);
      this.activeForm=null;
      });
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
  
  changeDependencies(depent : Dependencie): void {
//      this.cargandoReportes = true;
      this.activeDependencie = depent;
      this.dependencieforms=depent.forms;
   

}

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

}
