import { Component, OnInit, Input, Output, EventEmitter, OnDestroy, ViewChildren, QueryList } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Data } from '../../common/data';
import { FormlyFormOptions, FormlyFieldConfig } from '@ngx-formly/core';
import { pairwise, takeUntil, startWith, tap } from 'rxjs/operators';
import { Subject, Subscription, BehaviorSubject } from '../../../../node_modules/rxjs';
import { NotifierService } from 'angular-notifier';
import { MatDialog, DateAdapter } from '@angular/material';
import { ListService } from '../../services/list.service';
import { DataService } from '../../services/data.service';
import { FileService } from '../../services/file.service';
import { UtilService } from '../../services/util.service';
import { RepeatTypeComponent } from '../types/repeat-section/repeat-section.component';
import { LoginService } from '../../services/login.service';

@Component({
  selector: 'app-formly',
  templateUrl: './formly.component.html',
  styleUrls: ['./formly.component.css']
})
export class FormlyComponent implements OnInit, OnDestroy {

  @Input() formId: string;
  @Input() dependencyName: string;
  @Input() dependencyFormalName: string;
  @Input() typeSubmit = true;
  @Input() noDependency = false;
  @Input() adminReport = false;
  @Input() formData: Object = null;
  @Input() creator: string = null;
  @Input() clearButton = true;
  @Output() fullLoading = new EventEmitter();
  @Output() dataSaved = new EventEmitter();
  @Output() buttonClicked = new EventEmitter();
  @Output() reseted = new EventEmitter();

  @ViewChildren('repeat') components: QueryList<RepeatTypeComponent>;

  private _template = new BehaviorSubject<any>([]);
  @Input()
    set template(value) {
        this._template.next(value);
    }

    get template() {
        return this._template.getValue();
    }

  data: Data;
  options: FormlyFormOptions = {};
  form: FormGroup;
  formFields: Array<FormlyFieldConfig>;
  takeUntil;
  startWith;
  tap;
  onDestroy$;
  private readonly notifier: NotifierService;
  formLoaded: boolean;
  valueChangesSubscription: Subscription;
  currentId: string;
  saving: boolean;

  constructor(
    private dataService: DataService,
    private fileService: FileService,
    private listService: ListService,
    private utilService: UtilService,
    private loginService: LoginService,
    public dialog: MatDialog,
    notifierService: NotifierService,
    private dateAdapter: DateAdapter<Date>
  ) {
    this.data = new Data();
    this.form = new FormGroup({});
    this.takeUntil = takeUntil;
    this.startWith = startWith;
    this.tap = tap;
    this.onDestroy$ = new Subject<void>();
    this.notifier = notifierService;
    this.formLoaded = false;
    this.currentId = null;
    this.saving = false;
    this.dateAdapter.setLocale('es');
  }

  ngOnInit() {
    this._template
      .subscribe(x => {
        this.loadForm();
      });
  }

  /**
   * Loads an specified form from DB
   */
  loadForm() {
    if (this.options.resetModel) {
      this.options.resetModel();
    }

    if (this.formData == null) {
      this.formData = new Object();
    }
    const fields = this.template.fields;
    this.proccessFields(fields);
    this.formFields = fields;
    this.formLoaded = true;
    this.form = new FormGroup({});
  }

  proccessFields(fields) {
    // Proceess Validators
    this.evalJSFromJSON(fields, ['pattern', 'defaultValue', 'options', 'label', 'placeholder',
      'templateOptions?disabled', 'onInit', 'onDestroy', 'hideExpression', 'variable', 'watcher'], '');
  }

  /**
   * Eval all javascript strings from db
   */
  evalJSFromJSON(fields, keys, path) {
    for (const i in fields) {
      if (typeof fields[i] === 'object') {
        this.evalJSFromJSON(fields[i], keys, path + '[\'' + i + '\']');
      } else if (this.utilService.arrayContains(i, keys)) {
        try {
          // pendiente refactor en esta parte
          if (i === 'templateOptions?disabled') {
            fields[i.replace('?', '.')] = fields[i];
            delete fields[i];
          } else if (i === 'variable') {
            if (!this.options['formState']) {
              this.options['formState'] = {};
            }
            this.options['formState'][fields[i]] = 0;
          } else {
            fields[i] = eval(fields[i]); // no-eval
          }
        } catch (e) { }
      }
    }
  }

  resetConfirmation(): void {
    if (confirm('Esta acción limpiará el formulario. ¿Desea continuar?')) {
      this.reset();
    }
  }

  reset() {
    this.options.resetModel();
    this.currentId = null;
    this.reseted.emit(null);
  }

  onSubmit(template) {

    this.saving = true;

    this.uploadFiles(template);

    this.data = new Data();
    this.data.data = template;
    this.data.login = this.loginService.isLogIn();
    this.data.template = this.formId;
    this.data.origin = this.dependencyName;
    this.data.creator = this.creator;

    if (this.currentId != null) {
      this.data.id = this.currentId;
    }

    this.dataService.save(this.data)
      .subscribe(res => {
        this.reset();
        this.currentId = null;
        this.dataSaved.emit(null);
        this.saving = false;
        this.notifier.notify( 'success', 'OK: El formulario ha sido guardado exitosamente.' );
      },
        error => {
          this.saving = false;
          this.notifier.notify( 'error', 'ERROR: Error al guardar el formulario.' );
        });
  }

  uploadFile(file) {
    this.fileService.upload(file);
  }

  uploadFiles(template: Object) {

    const keys = Object.keys(template);
    let p = Promise.resolve();
    for (const key of keys) {
      if (template[key] instanceof FileList) {
        p = p.then(_ => new Promise(resolve => {
          const file: File = template[key][0];
          const formData: FormData = new FormData();
          formData.append('file', file);
          this.fileService.upload(formData).subscribe(response => {
            template[key] = response['fileDownloadUri'];
            resolve();
          });
        }));
      }
    }

    /*
    for (let i = 0, p = Promise.resolve(); i < Object.keys(template).length; i++) {
      if (template[Object.keys(template)[i]] instanceof FileList) {
        p = p.then(_ => new Promise(resolve => {
          const file: File = template[i][0];
          const formData: FormData = new FormData();
          formData.append('file', file);
          this.fileService.upload(formData).subscribe(response => {
            template[i] = response['fileDownloadUri'];
            resolve();
          });
        }));
      }
    }
    */

    /*
    return new Promise(resolve => {
      for (const i in template) {
        if (template[i] instanceof FileList) {
          const file: File = template[i][0];
          const formData: FormData = new FormData();
          formData.append('file', file);
          this.fileService.upload(formData).subscribe(response => {
            template[i] = file.name;
          });
        }
      }
    });
    */
  }

  copyData($event) {
    this.currentId = null;
    this.loadData($event);
  }

  editData($event) {
    this.loadData($event);
  }

  loadData(id) {
    this.fullLoading.emit(true);
    this.reset();
    this.dataService.getById(id)
      .subscribe(formData => {
        for (const i in formData.data) {
          if (formData.data[i] != null) {
            if (this.template.repeatSections.includes(i)) {
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
        this.currentId = id;
        this.fullLoading.emit(false);
      },
        error => {
          this.reset();
          this.notifier.notify( 'error', 'ERROR: Error al cargar los datos.' );
          this.fullLoading.emit(false);
        });
  }

  deleteData(id) {
    if (confirm('¿Está seguro que desea borrar el registro?')) {
      this.fullLoading.emit(true);
      this.dataService.delete(id)
        .subscribe(
          data => {
            this.fullLoading.emit(false);
            this.dataSaved.emit(null);
            this.notifier.notify( 'success', 'OK: Datos borrados exitosamente.' );
          },
          error => {
            this.fullLoading.emit(false);
            this.notifier.notify( 'error', 'ERROR: Error al borrar los datos.' );
          }
        );
    }
  }

  buttonClick(formData) {
    this.buttonClicked.emit(formData);
  }

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
    this._template.unsubscribe();
  }

}
