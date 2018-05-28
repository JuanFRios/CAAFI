import { Component, OnInit, OnDestroy, Inject, Input, ViewChild, ElementRef } from '@angular/core';
import { TemplatesService } from '../../services/templates.service';
import { ConfigService } from '../../services/config.service';
import { DataService } from '../../services/data.service';
import { FileService } from '../../services/file.service';
import { ListService } from '../../services/list.service';
import { Template } from '../../common/template';
import { Dependency } from '../../common/dependency';
import { Data } from '../../common/data';
import { Form } from '../../common/form';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { FormlyFormOptions, FormlyFieldConfig } from '@ngx-formly/core';
import { ActivatedRoute } from '@angular/router';
import { ModelDataSource } from './model-data-source';
import { MatTableModule } from '@angular/material/table';
import { MatPaginator } from '@angular/material';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { takeUntil, startWith, tap } from 'rxjs/operators';
import { ChangeDetectorRef } from '@angular/core';
import { LoginService } from '../../services/login.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-templates',
  templateUrl: './templates.component.html',
  styleUrls: ['./templates.component.css']
})
export class TemplatesComponent implements OnInit, OnDestroy {
  onDestroy$ = new Subject<void>();
  id: string;
  private sub: any;
  errorMessage: string[] = [];
  exito: boolean = false;
  cargando: boolean = false;
  form: FormGroup;
  formFields: Array<FormlyFieldConfig>;
  formData: Object;
  private data: Data;
  dependencies: Dependency[];
  activeDependency: Dependency;
  activeForm: string;
  activeFormPath: string;
  lists: String[][] = [];
  formName: string;
  options: FormlyFormOptions = {};
  variables: Object = {};
  takeUntil = takeUntil;
  startWith = startWith;
  tap = tap;
  tableColumns: String[];

  /*
  options: FormlyFormOptions = {
    formState : {
      valorEntidadesFinancierasExternas : 0
    }
  };
  */
  public loading = false;
  public loadingTable = false;

  dataSource: ModelDataSource | null;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild('filter') filter: ElementRef;
  paginatorSize = 0;
  displayedColumns = ["copy", "edit", "delete"];
  displayedColumnsData = [];
  displayedColumnsNames = [];
  currentId: string = null;
  repeatSections = [];
  namesRepeats = {};
  dates = [];
  booleans = [];

  constructor(
    private templatesService: TemplatesService,
    private dataService: DataService,
    private route: ActivatedRoute,
    private configService: ConfigService,
    private fileService: FileService,
    private listService: ListService,
    private cdRef: ChangeDetectorRef,
    private loginService: LoginService,
    public router: Router
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

  loadForm(form1: Form, depent: Dependency) {

    this.loading = true;
    this.errorMessage = [];
    this.exito = false;
    this.cargando = false;
    this.data = new Data();
    this.displayedColumns = ["copy", "edit", "delete"];
    this.displayedColumnsData = [];
    this.displayedColumnsNames = [];
    this.currentId = null;
    this.repeatSections = [];
    this.namesRepeats = {};
    this.dates = [];
    this.booleans = [];

    if (this.options.resetModel) {
        this.options.resetModel();
    }

    this.activeDependency = depent;
    console.log("dependency", this.activeDependency);
    this.form = new FormGroup({});
    //console.log(this.form);
    //console.log(this.form.controls);

    this.templatesService.getByName(form1.path)
      .subscribe(form2 => {
        
        this.variables = form2.variables;
        console.log(this.variables);

        this.form = new FormGroup({});
        //console.log('1', this.form.controls);

        this.activeForm = form1.name;

        //console.log('2', this.form.controls);

        this.activeFormPath = form1.path;

        //console.log('3', this.form.controls);

        this.formData = new Object();

        //console.log('4', this.form.controls);

        this.formName = form2.name;

        //console.log('5', this.form.controls);

        this.lists = [];

        this.tableColumns = form2.table;
        this.proccessFields(form2.fields);

        //console.log('6', this.form.controls);

        console.log(form2);
        if(this.lists.length > 0) {
          this.getList(this.lists, 0, form2.fields);
        } else {
            this.formFields = form2.fields;
            this.loading = false;
            this.loadDataTable();
            //console.log('7', this.form.controls);
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
    this.evalJSFromJSON(fields, ["pattern", "defaultValue", "optionsDB","key", "label", "type", "templateOptions?disabled", "onInit", "onDestroy", "hideExpression", "variable"], "");
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
          } else if (i === 'key' && !path.includes('fieldArray')) {
            if (!this.tableColumns || this.tableColumns.includes(fields[i])) {
              this.displayedColumns.push(fields[i]);
              this.displayedColumnsData.push(fields[i]);
              if (fields['type'] === 'repeat') {
                this.displayedColumnsNames[fields[i]] = fields.sectionName;
                this.repeatSections.push(fields[i]);
                for (const j of fields['fieldArray']['fieldGroup']) {
                  this.namesRepeats[j.key] = j.templateOptions.label;
                }
              } else {
                this.displayedColumnsNames[fields[i]] = fields.templateOptions.label;
              }
            }
          } else if (i === 'type' && fields[i] === 'datepicker') {
            this.dates.push(fields['key']);
          } else if (i === 'type' && fields[i] === 'checkbox') {
            this.booleans.push(fields['key']);
          } else if (i == "templateOptions?disabled") {
            fields[i.replace("?", ".")] = fields[i];
            delete fields[i];
          } else if (i === 'variable') {
            if (!this.options['formState']) {
              this.options['formState'] = {};
            }
            this.options['formState'][fields[i]] = 0;
            console.log(this.options['formState']);
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

    //console.log(template);

    this.errorMessage = [];
    this.exito = false;
    this.cargando = true;
    this.loading = true;

    this.data = new Data();
    var formsData: FormData[] = this.getFiles(template);
    this.data.data = template;
    this.data.template = this.formName;
    this.data.origin = this.activeDependency.name;

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
        this.loading = false;
      },
      error => {
        this.errorMessage.push(error);
        this.loading = false;
      });
  }

  loadData(id, isCopy) {
    this.loading = true;
    this.reset();

    this.dataService.getById(id)
      .subscribe(formData => {
        if (!isCopy) {
          this.currentId = formData.id;
        } else {
          this.currentId = null;
        }
        for (var i in formData.data) {
          console.log("i",i);
          if(this.repeatSections.includes(i)) {
            console.log("includes", i);
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
            console.log("get", this.form.get(i));
            this.form.get(i).patchValue(formData.data[i]);
            this.formData[i] = formData.data[i];
          }
        }
        this.loading = false;
      },
      error => {
        this.errorMessage = error;
        this.loading = false;
      });
  }

  deleteData(id) {
    if (confirm('¿Está seguro que desea borrar el registro?')) {
      this.loadingTable = true;
      this.dataService.delete(id)
      .subscribe(
        data  => {
          this.loadDataTable();
        },
        error => {
          this.errorMessage = error;
          this.loadingTable = false;
        }
      );
    }
  }

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
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
      //console.log('8', this.form.controls);
      
    }
  }

  loadDataTable() {
    this.loadingTable = true;
    console.log("dependency", this.activeDependency);
    this.dataService.getAllByTemplateAndDependency(this.activeFormPath, this.activeDependency.name)
      .subscribe(data => {

        this.processData(data);
        console.log(data);

        this.dataSource = new ModelDataSource(data, this.paginator);

        // Esto se hace para que el paginador esté actualizado con la cantidad de datos filtrados
        this.dataSource.getDataSize()
        .debounceTime(150)
        .distinctUntilChanged()
        .subscribe( size => {
          this.paginatorSize = size;
        });
        this.loadingTable = false;
      },
      error => {
        this.errorMessage.push(error);
        this.loadingTable = false;
      });
  }

  processData(data) {
    for (const i in data) {
      if (typeof data[i] === 'object' && !this.repeatSections.includes(i)) {
        this.processData(data[i]);
      } else {
        if (this.dates.includes(i)) {
          const options: Intl.DateTimeFormatOptions = {
            year: 'numeric', month: '2-digit', day: '2-digit'
          };
          const date: Date = new Date(data[i]);
          console.log(date);
          data[i] = date.toLocaleDateString('ja-JP', options);
        } else if (this.booleans.includes(i)) {
          if (data[i]) {
            data[i] = 'Si';
          } else {
            data[i] = 'No';
          }
        } else if (this.repeatSections.includes(i)) {
          let dataRepeat = '';
          for (const j = 0; j < data[i].length; j++ ) {
            dataRepeat += '{ ';
            for (const k in data[i][j]) {
              if (typeof data[i][j][k] === 'object') {
                dataRepeat += this.namesRepeats[k] + ': ' + data[i][j][k].toString() + ', ';
              } else {
                dataRepeat += this.namesRepeats[k] + ': ' + data[i][j][k] + ', ';
              }
            }
            dataRepeat = dataRepeat.slice(0, -2) + ' }, <br><br>';
          }
          data[i] = dataRepeat.slice(0, -10);
        }
      }
    }
  }

  resetConfirmation() {
    if (confirm('Esta acción limpiará el formulario. ¿Desea continuar?')) {
      this.reset();
    }
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
