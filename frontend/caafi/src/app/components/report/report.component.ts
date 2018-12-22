import { Component, OnInit } from '@angular/core';
import { TemplatesService } from '../../services/templates.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NotifierService } from 'angular-notifier';
import { UtilService } from '../../services/util.service';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css']
})

export class ReportComponent implements OnInit {

  private readonly notifier: NotifierService;
  fullLoading: boolean;
  formId: string;
  dependencyName: string;
  template: any;
  templateFilters: any;
  allDataAccess = false;
  noDependency = false;

  constructor(
    private templatesService: TemplatesService,
    private utilService: UtilService,
    notifierService: NotifierService,
    public router: Router
  ) {
    this.notifier = notifierService;
    this.fullLoading = false;
  }

  ngOnInit() {}

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
