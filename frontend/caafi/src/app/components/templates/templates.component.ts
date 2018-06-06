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
import { MatSort, MatPaginator, MatTableDataSource } from '@angular/material';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { takeUntil, startWith, tap, distinctUntilChanged, debounceTime } from 'rxjs/operators';
import { ChangeDetectorRef } from '@angular/core';
import { LoginService } from '../../services/login.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { merge } from 'rxjs/observable/merge';
import { fromEvent } from 'rxjs/observable/fromEvent';

@Component({
  selector: 'app-templates',
  templateUrl: './templates.component.html',
  styleUrls: ['./templates.component.css']
})
export class TemplatesComponent implements OnInit, OnDestroy {

  onDestroy$ = new Subject<void>();
  sub: any;
  errorMessage: string[] = [];
  exito = false;
  cargando = false;
  form: FormGroup;
  formFields: Array<FormlyFieldConfig>;
  formData: Object;
  data: Data;
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
  loading = false;
  model: Data;
  dataSource: ModelDataSource;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('filter') filter: ElementRef;
  paginatorSize = 0;
  displayedColumns = ['copy', 'edit', 'delete'];
  displayedColumnsData = [];
  displayedColumnsNames = [];
  currentId: string = null;
  repeatSections = [];
  namesRepeats = {};
  dates = [];
  booleans = [];
  tapPaginator: Subscription;
  sortChange: Subscription;
  filterEvent: Subscription;

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
      this.loadConfig();
    });

    this.dataSource = new ModelDataSource(this.dataService);
  }

  loadDataPage() {

    this.dataService.count(this.activeFormPath, this.activeDependency.name, this.filter.nativeElement.value)
      .subscribe(countData => {
        this.model = countData;
      },
        error => this.errorMessage.push(error));

    this.dataSource.loadData(this.activeFormPath, this.activeDependency.name,
      this.filter.nativeElement.value, this.sort.active, this.sort.direction, this.paginator.pageIndex, this.paginator.pageSize,
      this.repeatSections, this.dates, this.booleans, this.namesRepeats);
  }

  loadConfig() {
    this.configService.getTemplateConfig('dependencias')
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
    this.displayedColumns = ['copy', 'edit', 'delete'];
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
    console.log('dependency', this.activeDependency);
    this.form = new FormGroup({});

    this.templatesService.getByName(form1.path)
      .subscribe(form2 => {

        this.variables = form2.variables;
        console.log(this.variables);

        this.form = new FormGroup({});

        this.activeForm = form1.name;

        this.activeFormPath = form1.path;

        this.formData = new Object();

        this.formName = form2.name;

        this.lists = [];

        this.tableColumns = form2.table;
        this.proccessFields(form2.fields);

        console.log(form2);
        if (this.lists.length > 0) {
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
    this.evalJSFromJSON(fields, ['pattern', 'defaultValue', 'optionsDB', 'key', 'label', 'type',
      'templateOptions?disabled', 'onInit', 'onDestroy', 'hideExpression', 'variable'], '');
  }

  /**
   * Eval all javascript strings from db
   */
  evalJSFromJSON(fields, keys, path) {
    for (const i in fields) {
      if (typeof fields[i] === 'object') {
        this.evalJSFromJSON(fields[i], keys, path + '[\'' + i + '\']');
      } else if (this.arrayContains(i, keys)) {
        try {
          // pendiente refactor en esta parte
          if (i === 'optionsDB') {
            path = path + '[\'options\']';
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
          } else if (i === 'templateOptions?disabled') {
            fields[i.replace('?', '.')] = fields[i];
            delete fields[i];
          } else if (i === 'variable') {
            if (!this.options['formState']) {
              this.options['formState'] = {};
            }
            this.options['formState'][fields[i]] = 0;
            console.log(this.options['formState']);
          } else {
            fields[i] = eval(fields[i]); // no-eval
          }
        } catch (e) { }
      }
    }
  }

  onSubmit(template) {

    this.errorMessage = [];
    this.exito = false;
    this.cargando = true;
    this.loading = true;

    this.data = new Data();
    const formsData: FormData[] = this.getFiles(template);
    this.data.data = template;
    this.data.template = this.formName;
    this.data.origin = this.activeDependency.name;

    if (this.currentId != null) {
      this.data.id = this.currentId;
    }

    this.dataService.save(this.data)
      .subscribe(res => {
        for (let i = 0, len = formsData.length; i < len; i++) {
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
        for (const i in formData.data) {
          if (formData.data[i] != null) {
            if (this.repeatSections.includes(i)) {
              for (const j in formData.data[i]) {
                if (formData.data[i][j] != null) {
                  if (!this.form.get(i).get(j)) {
                    const element: HTMLElement = document.getElementById('button-add-' + i) as HTMLElement;
                    element.click();
                  }
                  this.form.get(i).get(j).patchValue(formData.data[i][j]);
                  this.formData[i][j] = formData.data[i][j];
                }
              }
            } else {
              if (this.form.get(i)) {
                this.form.get(i).patchValue(formData.data[i]);
                this.formData[i] = formData.data[i];
              }
            }
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
      this.dataService.delete(id)
        .subscribe(
          data => {
            this.loadDataTable();
          },
          error => {
            this.errorMessage = error;
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
    const formsData: FormData[] = [];
    for (const i in template) {
      if (template[i] && template[i][0] && typeof template[i][0].name === 'string' && template[i].length > 0) {
        const file: File = template[i][0];
        const formData: FormData = new FormData();
        const fecha_actual = new Date();
        const ano = fecha_actual.getFullYear();
        const mes = fecha_actual.getMonth() + 1;
        const dia = fecha_actual.getDate();
        const formato_fecha = '_' + ano + '-' + mes + '-' + dia;
        const nombre_archivo = i + formato_fecha;
        template[i] = nombre_archivo + '.pdf';
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
    if (list.length > current) {
      this.configService.getByName(list[current][1])
        .subscribe(confi => {
          eval('fields' + list[current][0] + ' = ' + JSON.stringify(confi.value)); // no-eval
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
    this.dataService.count(this.activeFormPath, this.activeDependency.name, '')
      .subscribe(countData => {
        this.model = countData;
      },
        error => this.errorMessage.push(error));

    this.dataSource.loadData(this.activeFormPath, this.activeDependency.name,
      '', '', '', 0, 5, this.repeatSections, this.dates, this.booleans, this.namesRepeats)
      .then(dataRetorno => { });

    if (this.sortChange) {
      this.sortChange.unsubscribe();
    }
    console.log('sort', this.sort);
    this.sortChange = this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);

    if (this.tapPaginator) {
      this.tapPaginator.unsubscribe();
    }
    this.paginator.pageIndex = 0;
    this.tapPaginator = merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        tap(() => this.loadDataPage())
      )
      .subscribe();

    // server-side search
    if (this.filterEvent) {
      this.filterEvent.unsubscribe();
    }
    this.filterEvent = fromEvent(this.filter.nativeElement, 'keyup')
      .pipe(
        debounceTime(150),
        distinctUntilChanged(),
        tap(() => {
          this.paginator.pageIndex = 0;
          this.loadDataPage();
        })
      )
      .subscribe();
  }

  processData(data, proccessedData, dataId) {
    for (const i in data) {
      if (typeof data[i] === 'object' && !this.repeatSections.includes(i)) {
        if (data[i] != null && data[i].id) {
          dataId = data[i].id;
        }
        this.processData(data[i], proccessedData, dataId);
        if (data[i] != null && data[i].constructor.name === 'Object' && !data[i]['data']) {
          data[i]['id'] = dataId;
          proccessedData.push(data[i]);
        }
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
          for (let j = 0; j < data[i].length; j++) {
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

    const elements: HTMLCollection = document.getElementsByClassName('button-remove-repeat') as HTMLCollection;
    let numElems = elements.length;
    while (numElems > 0) {
      (elements[0] as HTMLElement).click();
      numElems--;
    }

    this.options.resetModel();
  }

}
