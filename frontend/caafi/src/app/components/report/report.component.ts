import { Component, OnInit, ViewChildren, QueryList, ComponentFactory, ComponentFactoryResolver,
  AfterViewInit, ViewChild, ViewContainerRef, ComponentRef, OnDestroy, ElementRef, Input } from '@angular/core';
import { TemplatesService } from '../../services/templates.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NotifierService } from 'angular-notifier';
import { UtilService } from '../../services/util.service';
import { ListService } from '../../services/list.service';
import { DataTableComponent } from '../data-table/data-table.component';
import { ContainerComponent } from '../container/container.component';
import { Observable } from 'rxjs';
import { MatTabChangeEvent } from '@angular/material';
import { DataService } from '../../services/data.service';
import { ExcelService } from '../../services/excel.service';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css']
})

export class ReportComponent implements OnInit, OnDestroy, AfterViewInit {

  dataTableComponentFactory: ComponentFactory<DataTableComponent>;

  private readonly notifier: NotifierService;
  fullLoading: boolean;
  formId: string;
  dependencyName: string;
  template: any;
  templateFilters: any;
  allDataAccess = false;
  noDependency = false;
  dependenciesReport: any[] = null;
  noReport = false;
  adminReport = false;
  indexDependenciesTab = 0;
  indexReportsTab = 0;
  firstLoad = true;
  filters = '';
  filter = '';
  selectedTabDependency = new FormControl(0);

  @Input() exportCSVSpinnerButtonOptions: any = {
    active: false,
    text: 'Exportar Dependencia',
    spinnerSize: 18,
    raised: true,
    buttonColor: 'primary',
    spinnerColor: 'primary',
    disabled: false
  };

  @Input() exportAllCSVSpinnerButtonOptions: any = {
    active: false,
    text: 'Exportar Informe General',
    spinnerSize: 18,
    raised: true,
    buttonColor: 'primary',
    spinnerColor: 'primary',
    disabled: false
  };

  @ViewChildren(ContainerComponent) containers: QueryList<ContainerComponent>;
  @ViewChild(DataTableComponent) activeDataTable: DataTableComponent;

  constructor(
    private templatesService: TemplatesService,
    private utilService: UtilService,
    notifierService: NotifierService,
    public router: Router,
    private listService: ListService,
    private componentFactoryResolver: ComponentFactoryResolver,
    private resolver: ComponentFactoryResolver,
    private dataService: DataService,
    private excelService: ExcelService
  ) {
    this.notifier = notifierService;
    this.fullLoading = false;
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
      this.noReport = $event.noReport;
      this.adminReport = $event.adminReport;
      if (this.adminReport) {
        this.listService.dependencyList$.subscribe(
          dependencies => {
            this.dependenciesReport = dependencies;
          });
      } else {
        this.listService.getDependencyListById($event.dependencyId).subscribe(dependencies => {
          this.dependenciesReport = dependencies;
        });
      }
      this.loadReport($event.formId);
    }
  }

  /**
   * Loads an specified report from DB
   */
  loadReport(formId): Promise<any[]> {
    //this.toggleLoading(true);
    return new Promise(resolve => {
      this.templatesService.getByName(formId)
        .subscribe(template => {
          const templateData = this.utilService.deepCopy(template);
          this.utilService.loadTemplateFeatures(templateData, false);
          this.template = templateData;
          const templateForm = this.utilService.deepCopy(template);
          templateForm.fields = templateForm.report;
          this.utilService.loadTemplateFeatures(templateForm);
          this.templateFilters = templateForm;
          //this.toggleLoading(false);
          resolve();
        },
          error => {
            //this.toggleLoading(false);
            this.notifier.notify( 'error', 'ERROR: Error al cargar el formulario.' );
            resolve();
        });
    });
  }

  loadReportTemplate(formId): Promise<any> {
    //this.toggleLoading(true);
    return new Promise(resolve => {
      this.templatesService.getByName(formId)
        .subscribe(template => {
          const templateData = this.utilService.deepCopy(template);
          this.utilService.loadTemplateFeatures(templateData, false);
          const templateRes = templateData;
          //this.toggleLoading(false);
          resolve(templateRes);
        },
          error => {
            //this.toggleLoading(false);
            this.notifier.notify( 'error', 'ERROR: Error al cargar el formulario.' );
            resolve();
        });
    });
  }

  /**
   * Displays the loading
   */
  toggleLoading($event) {
    this.fullLoading = $event;
  }

  createDataTable() {
    const container = this.getContainer();
    if (container != null) {
      const containerRef = container.viewContainerRef;
      containerRef.clear();
      const factory: ComponentFactory<DataTableComponent> = this.resolver.resolveComponentFactory(DataTableComponent);
      setTimeout(() => {
        this.loadReportTemplate(container.formId).then(resolve => {
          const componentRef = containerRef.createComponent(factory);
          componentRef.instance.formId = container.formId;
          componentRef.instance.activeActions = container.activeActions;
          componentRef.instance.allDataAccess = container.allDataAccess;
          componentRef.instance.dependencyName = container.dependencyName;
          componentRef.instance.export = container.export;
          componentRef.instance.template = resolve;
          componentRef.instance.filters = this.filters;
          componentRef.instance.extFilter = this.filter;
          container.activeDataTable = componentRef.instance;
        });
      });
    }
  }

  createDataTableById(dependencyId, formId): Promise<DataTableComponent> {
    return new Promise(resolve => {
      const container = this.getContainerById(dependencyId, formId);
      if (container != null) {
        setTimeout(() => {
          this.loadReportTemplate(container.formId).then(template => {
            const dataTable: DataTableComponent = new DataTableComponent(this.dataService, this.excelService);
            dataTable.formId = container.formId;
            dataTable.activeActions = container.activeActions;
            dataTable.allDataAccess = container.allDataAccess;
            dataTable.dependencyName = container.dependencyName;
            dataTable.export = container.export;
            dataTable.template = template;
            dataTable.filters = this.filters;
            dataTable.extFilter = this.filter;
            resolve(dataTable);
          });
        });
      }
    });
  }

  getContainer(): any {
    const containersArray = this.containers.toArray();
    if (this.dependenciesReport != null) {
      const dependencyId = this.dependenciesReport[this.indexDependenciesTab].path;
      const formId = this.dependenciesReport[this.indexDependenciesTab].forms[this.indexReportsTab].path;
      for (const container of containersArray) {
        if (container.dependencyId === dependencyId && container.formId === formId) {
          return container;
        }
      }
    }
    return null;
  }

  getContainerById(dependencyId, formId): any {
    const containersArray = this.containers.toArray();
    if (this.dependenciesReport != null) {
      for (const container of containersArray) {
        if (container.dependencyId === dependencyId && container.formId === formId) {
          return container;
        }
      }
    }
    return null;
  }

  getContainersDependency(): Array<ContainerComponent> {
    const arrayContainers = new Array<ContainerComponent>();
    const containersArray = this.containers.toArray();
    if (this.dependenciesReport != null) {
      const dependencyId = this.dependenciesReport[this.indexDependenciesTab].path;
      for (const container of containersArray) {
        if (container.dependencyId === dependencyId) {
          arrayContainers.push(container);
        }
      }
    }
    return arrayContainers;
  }

  ngOnDestroy() {}

  dependencyTabSelectionChanged(event) {
    this.indexDependenciesTab = event.index;
    this.indexReportsTab = 0;
    this.createDataTable();
  }

  formTabSelectionChanged(event: MatTabChangeEvent) {
    this.indexReportsTab = event.index;
    this.createDataTable();
  }

  exportCSV(event) {
    const containers = this.getContainersDependency();
    const shetNames = new Array();
    const jsonArray = new Array();
    for (const container of containers) {
      this.createDataTableById(container.dependencyId, container.formId).then(dataTable => {
        dataTable.externalExportReport().then(data => {
          shetNames.push(container.formId.substring(0, 31));
          jsonArray.push(data);
          if (jsonArray.length === containers.length) {
            this.excelService.exportAsExcelFileMultipleSheets(jsonArray, 'reporte-' + container.dependencyId, shetNames);
          }
        });
      });
    }
  }

  exportAllCSV(event) {
    const containers = this.containers.toArray();
    const shetNames = new Array();
    const jsonArray = new Array();
    for (const container of containers) {
      this.createDataTableById(container.dependencyId, container.formId).then(dataTable => {
        dataTable.externalExportReport().then(data => {
          shetNames.push(container.dependencyId.substring(0, 10) + '-' + container.formId.substring(0, 10) + '-'
          + Date.now().toString().substring(0, 9));
          jsonArray.push(data);
          if (jsonArray.length === containers.length) {
            this.excelService.exportAsExcelFileMultipleSheets(jsonArray, 'reporte-todo-', shetNames);
          }
        });
      });
    }
  }

  public ngAfterViewInit(): void {
    this.containers.changes.subscribe((comps: QueryList<ContainerComponent>) => {
      this.containers.reset(comps.toArray());
    });
  }

  filterData(event) {
    if (!this.noReport) {
      this.activeDataTable.filterData(event);
    } else {
      const jsonFilters = {};
      if (event['tea-grupoInvestigacion'] != null) {
        jsonFilters['tea-grupoInvestigacion'] = event['tea-grupoInvestigacion'];
      }
      if (event['tle-semestre'] != null) {
        jsonFilters['tle-semestre'] = event['tle-semestre'];
      }
      if (event['tge-semestre'] != null) {
        jsonFilters['tge-semestre'] = event['tge-semestre'];
      }
      if (event['te-semestre'] != null) {
        jsonFilters['te-semestre'] = event['te-semestre'];
      }
      if (event['tea-'] != null) {
        this.filter = event['tea-'];
      }
      const urlFilters = encodeURIComponent(JSON.stringify(jsonFilters));
      this.filters = urlFilters;
      if (event['te-dependencia'] != null) {
        this.listService.getDependencyListById(event['te-dependencia']).subscribe(
          dependencies => {
            this.dependenciesReport = dependencies;
            setTimeout(() => {
              this.selectedTabDependency.setValue(0);
              if (this.indexDependenciesTab === 0) {
                this.indexReportsTab = 0;
                this.createDataTable();
              }
            }, 0);
          });
      } else {
        this.listService.getDependencyList().subscribe(
          dependencies => {
            this.dependenciesReport = dependencies;
            setTimeout(() => {
              this.selectedTabDependency.setValue(0);
              if (this.indexDependenciesTab === 0) {
                this.indexReportsTab = 0;
                this.createDataTable();
              }
            }, 0);
          });
      }
    }
  }

  resetFilters(event) {
    if (!this.noReport) {
      this.activeDataTable.refresh(event);
    } else {
      this.filters = '';
      this.filter = '';
      this.listService.getDependencyList().subscribe(
        dependencies => {
          this.dependenciesReport = dependencies;
          setTimeout(() => {
            this.selectedTabDependency.setValue(0);
            if (this.indexDependenciesTab === 0) {
              this.indexReportsTab = 0;
              this.createDataTable();
            }
          }, 0);
        });
    }
  }
}
