import { Component, OnInit, ViewChildren, QueryList, ComponentFactory, ComponentFactoryResolver,
  AfterViewInit, ViewChild, ViewContainerRef, ComponentRef, OnDestroy, ElementRef } from '@angular/core';
import { TemplatesService } from '../../services/templates.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NotifierService } from 'angular-notifier';
import { UtilService } from '../../services/util.service';
import { ListService } from '../../services/list.service';
import { DataTableComponent } from '../data-table/data-table.component';
import { ContainerComponent } from '../container/container.component';
import { Observable } from 'rxjs';
import { MatTabChangeEvent } from '@angular/material';

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
  dependenciesReport = null;
  noReport = false;
  //componentRef: ComponentRef<DataTableComponent>;

  @ViewChildren(ContainerComponent) containers: QueryList<ContainerComponent>;

  constructor(
    private templatesService: TemplatesService,
    private utilService: UtilService,
    notifierService: NotifierService,
    public router: Router,
    private listService: ListService,
    private componentFactoryResolver: ComponentFactoryResolver,
    private resolver: ComponentFactoryResolver
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
      this.noReport = $event.noReport;
      this.loadReport($event.formId);
    }
  }

  /**
   * Loads an specified report from DB
   */
  loadReport(formId): Promise<any[]> {
    return new Promise(resolve => {
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
          resolve();
        },
          error => {
            this.toggleLoading(false);
            this.notifier.notify( 'error', 'ERROR: Error al cargar el formulario.' );
            resolve();
        });
    });
  }

  loadReportTemplate(formId): Promise<any> {
    return new Promise(resolve => {
      this.toggleLoading(true);
      this.templatesService.getByName(formId)
        .subscribe(template => {
          const templateData = this.utilService.deepCopy(template);
          this.utilService.loadTemplateFeatures(templateData, false);
          const templateRes = templateData;
          this.toggleLoading(false);
          resolve(templateRes);
        },
          error => {
            this.toggleLoading(false);
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

  createDataTable(indexTab) {
    const containersArray = this.containers.toArray();
    const container = containersArray[indexTab];
    const containerRef = containersArray[indexTab].viewContainerRef;
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
      });
    });
  }

  ngOnDestroy() {
    //this.componentRef.destroy();
  }

  public ngAfterViewInit(): void {
    this.containers.changes.subscribe((comps: QueryList<ContainerComponent>) => {
      if (this.containers != null && this.containers.length > 0) {
        this.createDataTable(0);
      }
    });
  }

  dependencyTabSelectionChanged($event) {
    console.log($event);
  }

  formTabSelectionChanged($event) {
    this.createDataTable($event.index);
  }

}
