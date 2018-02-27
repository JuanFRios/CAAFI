import { Component, OnInit, OnDestroy, Inject, Input, ViewChild, ElementRef } from '@angular/core';
import { TemplatesService } from '../../services/templates.service';
import { ConfigService } from '../../services/config.service';
import { DataService } from '../../services/data.service';
import { FileService } from '../../services/file.service';
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
  activeForm: string;
  lists: String[][] = [];

  constructor(
    private templatesService: TemplatesService,
    private dataService: DataService,
    private route: ActivatedRoute,
    private configService: ConfigService,
    private fileService: FileService,
  ) { }

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      this.id = params['id'];

      this.loadConfig();
    });
  }
  loadConfig() {
    this.form = new FormGroup({});
    this.configService.getTemplateConfig()
      .subscribe(form => {
        this.dependencies = form.value;
      },
      error => this.errorMessage.push(error));
  }

  loadForm(form1: Form, depent: Dependencie) {
    this.activeDependencie = depent;
    this.form = new FormGroup({});
    this.templatesService.getByName(form1.path)
      .subscribe(form => {
        this.activeForm = form1.name;
        this.formData = new Object();

        this.lists = [];
        this.proccessFields(form.fields);
        if(this.lists.length > 0) {
          this.getList(this.lists, 0, form.fields);
        } else {
            this.formFields = form.fields;
        }
      },
      error => {
        this.errorMessage.push(error);
        this.activeForm = null;
      });
  }

  proccessFields(fields) {

    // Proceess Validators
    this.evalJSFromJSON(fields, ["pattern", "defaultValue", "optionsDB"], "");
  }

  /**
   * Eval all javascript strings from db
   */
  evalJSFromJSON(fields, keys, path) {
    for (var i in fields) {
      if (typeof fields[i] == "object") {
        this.evalJSFromJSON(fields[i], keys, path+"['"+i+"']");
      } else if (this.arrayContains(i, keys)) {
        try {
          // pendiente refactor en esta parte
          if(i == "optionsDB") {
              //fields["options"] = eval(fields[i]);
              path = path+"['options']";
              this.lists.push([path, fields[i]]);
          } else {
              fields[i] = eval(fields[i]);
          }
        } catch (e) {
          console.log("El campo " + i + ":" + fields[i] + " no representa una cadena javascript. Error: " + e.message);
        }
      }
    }
  }

  onSubmit(template) {
    this.errorMessage = [];
    this.exito = false;
    this.cargando = true;

    this.data = new Data();
    var formsData: FormData[] = this.getFiles(template);
    this.data.data = template;

    this.dataService.save(this.data)
      .subscribe(res => {
        for (var i = 0, len = formsData.length; i < len; i++) {
          this.uploadFile(formsData[i]);
        }
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

  arrayContains(needle, arrhaystack) {
    return (arrhaystack.indexOf(needle) > -1);
  }

  getFiles(template) {
    var formsData : FormData[] = [];
    for (var i in template) {
      if(template[i][0] && typeof template[i][0].name == "string" && template[i].length > 0) {
        let file: File = template[i][0];
        let formData: FormData = new FormData();
        const fecha_actual = new Date();
        const ano = fecha_actual.getFullYear();
        const mes = fecha_actual.getMonth() + 1;
        const dia = fecha_actual.getDate();
        const formato_fecha = "_" + ano + "-" + mes + "-" + dia;
        let nombre_archivo = i + formato_fecha;
        template[i] = nombre_archivo + ".pdf";
        formData.append('file', file, nombre_archivo);
        formsData.push(formData);
      }
    }
    return formsData;
  }

  uploadFile(file) {
    this.fileService.upload(file);
  }

  getList(list, current, fields) {
    if(list.length > current) {
      this.configService.getByName(list[current][1])
      .subscribe(confi => {
        eval("fields"+list[current][0]+" = "+JSON.stringify(confi.value));
        current++;
        this.getList(list, current, fields);
      });
    } else {
      this.formFields = fields;
    }
  }

}
