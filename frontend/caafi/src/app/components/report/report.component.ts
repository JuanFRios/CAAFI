import { Component, OnInit, ViewChildren, QueryList, ComponentFactory, ComponentFactoryResolver, AfterViewInit } from '@angular/core';
import { TemplatesService } from '../../services/templates.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NotifierService } from 'angular-notifier';
import { UtilService } from '../../services/util.service';
import { ListService } from '../../services/list.service';
import { DataTableComponent } from '../data-table/data-table.component';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css']
})

export class ReportComponent implements OnInit {

  dataTableComponentFactory: ComponentFactory<DataTableComponent>;

  private readonly notifier: NotifierService;
  fullLoading: boolean;
  formId: string;
  dependencyName: string;
  template: any;
  templateFilters: any;
  allDataAccess = false;
  noDependency = false;
  dependenciesReport = null;

  constructor(
    private templatesService: TemplatesService,
    private utilService: UtilService,
    notifierService: NotifierService,
    public router: Router,
    private listService: ListService,
    private componentFactoryResolver: ComponentFactoryResolver
  ) {
    this.notifier = notifierService;
    this.fullLoading = false;

    this.listService.dependencyList$.subscribe(
      dependencies => {
        this.dependenciesReport = dependencies;
      });
  }

  ngOnInit() {
    this.dataTableComponentFactory = this.componentFactoryResolver.resolveComponentFactory(DataTableComponent);
  }

  onSelectMenuItem($event) {
    if ($event.formId != null) {
      this.formId = $event.formId;
      this.dependencyName = $event.dependencyName;
      this.allDataAccess = $event.allDataAccess;
      this.noDependency = $event.noDependency;
      this.loadReport($event.formId);
    }
  }

  /**
   * Loads an specified report from DB
   */
  loadReport(formId) {
    this.toggleLoading(true);

    this.templatesService.getByName(formId)
      .subscribe(template => {
        const templateData = this.utilService.deepCopy(template);
        this.utilService.loadTemplateFeatures(templateData, false);
        this.template = templateData;
        const templateForm = this.utilService.deepCopy(template);
        templateForm.fields = templateForm.report;
        this.utilService.loadTemplateFeatures(templateForm);
        this.templateFilters = templateForm;
        this.toggleLoading(false);
      },
        error => {
          this.toggleLoading(false);
          this.notifier.notify( 'error', 'ERROR: Error al cargar el formulario.' );
      });
  }

  /**
   * Displays the loading
   */
  toggleLoading($event) {
    this.fullLoading = $event;
  }

}
