import { Component, OnInit, Input } from '@angular/core';
import { TemplatesService } from '../../services/templates.service';
import { FormGroup } from '@angular/forms';
import { Data } from '../../common/data';
import { FormlyFormOptions, FormlyFieldConfig } from '@ngx-formly/core';
import { ConfigService } from '../../services/config.service';

@Component({
  selector: 'app-formly',
  templateUrl: './formly.component.html',
  styleUrls: ['./formly.component.css']
})
export class FormlyComponent implements OnInit {

  @Input() formName: string;

  data: Data;
  currentId: string;
  repeatSections;
  namesRepeats = {};
  dates = [];
  booleans = [];
  files = [];
  options: FormlyFormOptions;
  variables: Object;
  form: FormGroup;
  formData: Object;
  lists: String[][];
  formFields: Array<FormlyFieldConfig>;

  constructor(
    private templatesService: TemplatesService,
    private configService: ConfigService
  ) {
    this.currentId = null;
    this.data = new Data();
    this.currentId = null;
    this.repeatSections = [];
    this.options = {};
    this.variables = {};
    this.namesRepeats = {};
    this.dates = [];
    this.booleans = [];
    this.files = [];
    this.form = new FormGroup({});
    this.lists = [];
  }

  ngOnInit() {
    if (this.formName != null) {
      this.loadForm();
    }
  }

  /**
   * Loads an specified form from DB
   */
  loadForm() {
    if (this.options.resetModel) {
      this.options.resetModel();
    }

    this.templatesService.getByName(this.formName)
      .subscribe(template => {
        this.variables = template.variables;
        this.formData = new Object();
        this.lists = [];
        const fields = template.fields;
        this.proccessFields(fields);
        this.getList(this.lists, 0, fields);
        this.formFields = fields;
      },
        error => {
          console.log('ERROR: ', error);
          /*
          this.errorMessage.push(error);
          this.activeForm = null;
          this.loading = false;
          */
        });
  }

  proccessFields(fields) {
    // Proceess Validators
    this.evalJSFromJSON(fields, ['pattern', 'defaultValue', 'optionsDB', 'label',
      'templateOptions?disabled', 'onInit', 'onDestroy', 'hideExpression', 'variable', 'watcher'], '');
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
          } else if (i === 'templateOptions?disabled') {
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

  getList(list, current, fields) {
    if (this.lists.length > 0) {
      if (list.length > current) {
        this.configService.getByName(list[current][1])
          .subscribe(confi => {
            eval('fields' + list[current][0] + ' = ' + JSON.stringify(confi.value)); // no-eval
            current++;
            this.getList(list, current, fields);
          });
      }
    }
  }

  arrayContains(needle, arrhaystack) {
    return (arrhaystack.indexOf(needle) > -1);
  }

}
