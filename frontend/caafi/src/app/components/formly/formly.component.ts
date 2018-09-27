import { Component, OnInit, Input } from '@angular/core';
import { TemplatesService } from '../../services/templates.service';

@Component({
  selector: 'app-formly',
  templateUrl: './formly.component.html',
  styleUrls: ['./formly.component.css']
})
export class FormlyComponent implements OnInit {

  @Input() formName: string;

  constructor(
    private templatesService: TemplatesService
  ) { }

  ngOnInit() {
    this.loadForm();
  }

  /**
   * Loads an specified form from DB
   */
  loadForm() {

    /*
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
    this.files = [];

    if (this.options.resetModel) {
      this.options.resetModel();
    }

    this.activeDependency = dependency;
    this.activeForm = activeForm;
    this.form = new FormGroup({});
    */

    this.templatesService.getByName(this.formName)
      .subscribe(template => {

        console.log('template: ', template);
        /*
        this.variables = template.variables;

        this.form = new FormGroup({});

        this.formData = new Object();

        this.lists = [];

        this.tableColumns = template.table;

        let fields = template.fields;
        if (this.isReport) {
          fields = template.report;
        }
        this.showForm = fields && fields.length > 0 ? true : false;

        this.proccessFields(fields);
        this.getList(this.lists, 0, fields);

        this.formFields = fields;
        this.loading = false;
        //this.loadDataTable();
        this.form = new FormGroup({});
        */
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

}
