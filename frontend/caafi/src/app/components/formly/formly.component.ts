import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges, SimpleChange, OnDestroy } from '@angular/core';
import { TemplatesService } from '../../services/templates.service';
import { FormGroup } from '@angular/forms';
import { Data } from '../../common/data';
import { FormlyFormOptions, FormlyFieldConfig } from '@ngx-formly/core';
import { ConfigService } from '../../services/config.service';
import { takeUntil, startWith, tap } from 'rxjs/operators';
import { Subject, Subscription } from '../../../../node_modules/rxjs';
import { NotifierService } from 'angular-notifier';
import { MatDialog } from '@angular/material';
import { ListService } from '../../services/list.service';
import { DataService } from '../../services/data.service';
import { FileService } from '../../services/file.service';
import { UtilService } from '../../services/util.service';

@Component({
  selector: 'app-formly',
  templateUrl: './formly.component.html',
  styleUrls: ['./formly.component.css']
})
export class FormlyComponent implements OnInit, OnChanges, OnDestroy {

  @Input() formId: string;
  @Input() dependencyName: string;
  @Output() fullLoading = new EventEmitter();
  @Output() dataSaved = new EventEmitter();

  data: Data;
  repeatSections;
  namesRepeats;
  dates;
  booleans;
  files;
  options: FormlyFormOptions;
  variables: Object;
  form: FormGroup;
  formData: Object;
  formFields: Array<FormlyFieldConfig>;
  takeUntil;
  startWith;
  tap;
  onDestroy$;
  private readonly notifier: NotifierService;
  formLoaded: boolean;
  valueChangesSubscription: Subscription;

  resetButtonOptions = {
    active: false,
    text: 'Limpiar',
    buttonColor: 'primary',
    barColor: 'primary',
    mode: 'indeterminate',
    value: 0,
    raised: true,
    stroked: true,
    disabled: false
  };

  submitButtonOptions = {
    active: false,
    text: 'Guardar',
    buttonColor: 'primary',
    barColor: 'primary',
    mode: 'indeterminate',
    value: 0,
    raised: true,
    stroked: true,
    disabled: true
  };

  constructor(
    private templatesService: TemplatesService,
    private dataService: DataService,
    private fileService: FileService,
    private listService: ListService,
    private utilService: UtilService,
    public dialog: MatDialog,
    notifierService: NotifierService,
  ) {
    this.data = new Data();
    this.repeatSections = [];
    this.options = {};
    this.variables = {};
    this.namesRepeats = {};
    this.dates = [];
    this.booleans = [];
    this.files = [];
    this.form = new FormGroup({});
    this.takeUntil = takeUntil;
    this.startWith = startWith;
    this.tap = tap;
    this.onDestroy$ = new Subject<void>();
    this.notifier = notifierService;
    this.formLoaded = false;
  }

  ngOnInit() {
    this.valueChangesSubscription = this.form.valueChanges.subscribe(value => {
      this.submitButtonOptions.disabled = !this.form.valid;
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    const formId: SimpleChange = changes.formId;
    if (formId != null) {
      this.formId = formId.currentValue;
      this.loadForm();
    }
  }

  /**
   * Loads an specified form from DB
   */
  loadForm() {
    this.fullLoading.emit(true);

    if (this.options.resetModel) {
      this.options.resetModel();
    }

    this.templatesService.getByName(this.formId)
      .subscribe(template => {
        this.variables = template.variables;
        this.formData = new Object();
        const fields = template.fields;
        this.proccessFields(fields);
        this.formFields = fields;
        this.formLoaded = true;
        this.fullLoading.emit(false);
      },
        error => {
          this.fullLoading.emit(false);
          this.notifier.notify( 'error', 'ERROR: Error al cargar el formulario.' );
        });
  }

  proccessFields(fields) {
    // Proceess Validators
    this.evalJSFromJSON(fields, ['pattern', 'defaultValue', 'options', 'label',
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
    const elements: HTMLCollection = document.getElementsByClassName('button-remove-repeat') as HTMLCollection;
    let numElems = elements.length;
    while (numElems > 0) {
      (elements[0] as HTMLElement).click();
      numElems--;
    }
    this.options.resetModel();
  }

  onSubmit(template) {

    this.submitButtonOptions.active = true;
    this.fullLoading.emit(true);

    this.data = new Data();
    const formsData: FormData[] = this.getFiles(template);
    this.data.data = template;
    this.data.template = this.formId;
    this.data.origin = this.dependencyName;

    /*
    if (this.currentId != null) {
      this.data.id = this.currentId;
    }
    */

    this.dataService.save(this.data)
      .subscribe(res => {
        for (let i = 0, len = formsData.length; i < len; i++) {
          this.uploadFile(formsData[i]);
        }
        this.reset();
        this.fullLoading.emit(false);
        this.dataSaved.emit(null);
        this.submitButtonOptions.active = false;
        this.notifier.notify( 'success', 'OK: El formulario ha sido guardado exitosamente.' );
      },
        error => {
          this.fullLoading.emit(false);
          this.submitButtonOptions.active = false;
          this.notifier.notify( 'error', 'ERROR: Error al guardar el formulario.' );
        });
  }

  uploadFile(file) {
    this.fileService.upload(file);
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

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
    this.valueChangesSubscription.unsubscribe();
  }

}
