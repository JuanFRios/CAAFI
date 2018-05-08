import { Component, OnInit, OnDestroy, Inject, Input, ViewChild, ElementRef } from '@angular/core';
import { TemplatesService } from '../../services/templates.service';
import { ConfigService } from '../../services/config.service';
import { DataService } from '../../services/data.service';
import { FileService } from '../../services/file.service';
import { ListService } from '../../services/list.service';
import { Template } from '../../common/template';
import { Dependencie } from '../../common/dependencie';
import { Data } from '../../common/data';
import { Form } from '../../common/form';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { ActivatedRoute } from '@angular/router';
import { FormlyFormOptions } from '@ngx-formly/core';
import { ModelDataSource } from './model-data-source';
import { MatTableModule } from '@angular/material/table';
import { MatPaginator } from '@angular/material';
import { Observable } from 'rxjs/Observable';

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
  activeFormPath: string;
  lists: String[][] = [];
  formName: string;
  options: FormlyFormOptions = {};
  public loading = false;

  dataSource: ModelDataSource | null;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild('filter') filter: ElementRef;
  paginatorSize = 0;
  displayedColumns = ["edit"];
  displayedColumnsData = [];
  displayedColumnsNames = [];
  currentId: string = null;
  repeatSections = [];

  constructor(
    private templatesService: TemplatesService,
    private dataService: DataService,
    private route: ActivatedRoute,
    private configService: ConfigService,
    private fileService: FileService,
    private listService: ListService,
  ) { }

  ngOnInit() {  
    this.sub = this.route.params.subscribe(params => {
      this.id = params['id'];

      this.loadConfig();
    });

    /*
    // Se crea un Observable para el input que servirá para realizar el filtro
    Observable.fromEvent(this.filter.nativeElement, 'keyup')
    .debounceTime(150)
    .distinctUntilChanged()
    .subscribe(() => {
      if (!this.dataSource) { return; }
      this.dataSource.filter = this.filter.nativeElement.value;
      // Movemos el paginador a la página 0
      this.paginator.pageIndex = 0;
    });
    */

  }
  loadConfig() {
    //this.form = new FormGroup({});
    this.configService.getTemplateConfig("dependencias")
      .subscribe(form => {
        this.dependencies = form.value;
      },
      error => this.errorMessage.push(error));
  }

  loadForm(form1: Form, depent: Dependencie) {

    this.loading = true;
    this.errorMessage = [];
    this.exito = false;
    this.cargando = false;
    this.data = new Data();
    this.displayedColumns = ["edit"];
    this.displayedColumnsData = [];
    this.displayedColumnsNames = [];
    this.currentId = null;
    this.repeatSections = [];

    if(this.options.resetModel) {
        this.options.resetModel();
    };

    this.form = new FormGroup({});
    this.activeDependencie = depent;
    this.templatesService.getByName(form1.path)
      .subscribe(form2 => {

        this.activeForm = form1.name;
        this.activeFormPath = form1.path;
        this.formData = new Object();
        this.formName = form2.name;
        this.lists = [];
        this.proccessFields(form2.fields);

        if(this.lists.length > 0) {
          this.getList(this.lists, 0, form2.fields);
        } else {
            this.formFields = form2.fields;
            this.loading = false;
            this.loadDataTable();
        }
      },
      error => {
        this.errorMessage.push(error);
        this.activeForm = null;
        this.loading = false;
      });
  }

  proccessFields(fields) {

    // Proceess Validators
    this.evalJSFromJSON(fields, ["pattern", "defaultValue", "optionsDB", "options", "key", "label", "type"], "");
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
          } else if (i == "key" && fields.type != "repeat" && !path.includes("fieldArray")) {
            this.displayedColumns.push(fields[i]);
            this.displayedColumnsData.push(fields[i]);
            this.displayedColumnsNames[fields[i]] = fields.templateOptions.label;
          } else if(i == "type" && fields[i] == "repeat") {
            this.repeatSections.push(fields["key"]);
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
    this.data.template = this.formName;
    this.data.origin = this.activeDependencie.name;

    if(this.currentId != null) {
      this.data.id = this.currentId
    }

    this.dataService.save(this.data)
      .subscribe(res => {
        for (var i = 0, len = formsData.length; i < len; i++) {
          this.uploadFile(formsData[i]);
        }
        this.loadDataTable();
        this.reset();
        this.exito = true;
        this.cargando = false;
      },
      error => this.errorMessage.push(error));
  }

  loadData(id) {

    this.reset();

    this.dataService.getById(id)
      .subscribe(formData => {
        this.currentId = formData.id;
        for (var i in formData.data) {
          if(this.repeatSections.includes(i)) {
            if(formData.data[i].length > 0) {
              for(var j in formData.data[i]) {
                if(!this.form.get(i).get(j)) {
                  let element: HTMLElement = document.getElementById("button-add-"+i) as HTMLElement;
                  element.click();
                }
                this.form.get(i).get(j).patchValue(formData.data[i][j]);
                this.formData[i][j] = formData.data[i][j];
              }
            }
          } else {
            this.form.get(i).patchValue(formData.data[i]);
            this.formData[i] = formData.data[i];
          }
        }
      },
      error => this.errorMessage = error);
  }

  ngOnDestroy() {
    
  }

  arrayContains(needle, arrhaystack) {
    return (arrhaystack.indexOf(needle) > -1);
  }

  getFiles(template) {
    var formsData : FormData[] = [];
    for (var i in template) {
      if(template[i] && template[i][0] && typeof template[i][0].name == "string" && template[i].length > 0) {
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
      this.loading = false;
      this.loadDataTable();

      this.form = new FormGroup({});
    }
  }

  loadDataTable() {
    this.dataService.getAllByTemplate(this.activeFormPath)
      .subscribe(data => {
        this.dataSource = new ModelDataSource(data, this.paginator);

        // Esto se hace para que el paginador esté actualizado con la cantidad de datos filtrados
        this.dataSource.getDataSize()
        .debounceTime(150)
        .distinctUntilChanged()
        .subscribe( size => {
          this.paginatorSize = size;
        });

      },
      error => this.errorMessage.push(error));
  }

  reset() {

    this.currentId = null;

    let elements: HTMLCollection = document.getElementsByClassName("button-remove-repeat") as HTMLCollection;
    var numElems = elements.length;
    while(numElems > 0) {
      (elements[0] as HTMLElement).click();
      numElems--;
    }

    this.options.resetModel();
  }

}
