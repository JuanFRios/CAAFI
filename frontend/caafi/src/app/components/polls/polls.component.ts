import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { TemplatesService } from '../../services/templates.service';
import { Router } from '@angular/router';
import { httpBaseURL } from '../../common/baseurl';
import { UtilService } from '../../services/util.service';
import { NotifierService } from 'angular-notifier';
import { LoginService } from '../../services/login.service';
import { Template } from '../../common/template';

@Component({
  selector: 'app-polls',
  templateUrl: './polls.component.html',
  styleUrls: ['./polls.component.css']
})
export class PollsComponent implements OnInit {

  private readonly notifier: NotifierService;
  public dateTimeRange: Date[];
  public emails: string;
  formId: string;
  formName: string;
  dependencyId: string;
  fullLoading: boolean;
  dependencyName: string;
  varFields;
  fields: any;
  template: any;
  public = false;

  constructor(
    private templatesService: TemplatesService,
    private utilService: UtilService,
    public loginService: LoginService,
    notifierService: NotifierService,
    public router: Router
  ) {
    this.notifier = notifierService;
    this.fullLoading = false;
    this.varFields = {};
  }

  ngOnInit() {}

  onSelectMenuItem($event) {
    if ($event.formId != null) {
      this.formId = $event.formId;
      this.dependencyName = $event.dependencyName;
      this.formName = $event.formName;
      this.dependencyId = $event.dependencyId;
      this.loadTemplate($event.formId);
    }
  }

  /**
   * Loads an specified template from DB
   */
  loadTemplate(formId) {
    this.toggleLoading(true);

    this.templatesService.getByName(formId)
      .subscribe(template => {
        this.utilService.loadTemplateFeatures(template, false);
        this.template = template;
        this.emails = template.config['emails'];
        this.dateTimeRange = template.config['dateRange'];
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

  savePoll() {
    this.fullLoading = true;
    const data: Template = new Template();
    data.name = this.formId;
    data.config = new Object();
    data.config['emails'] = this.emails;
    data.config['dateRange'] = this.dateTimeRange;
    this.templatesService.saveTemplateConfig(data)
    .subscribe(result => {
      if (result.response > 0) {
        this.notifier.notify( 'success', 'OK: Configuración encuesta guardada.' );
      }
      this.fullLoading = false;
    },
    error => {
      this.notifier.notify( 'error', 'ERROR: Error al guardar la configuracón de la encuesta.' );
      this.fullLoading = false;
    });
  }

  sendPoll(emails) {
    this.fullLoading = true;
    this.templatesService.senTemplateByEmail(this.formName, emails, httpBaseURL + '/encuestas/' +
      this.dependencyId + '/' + this.formId)
    .subscribe(result => {
      if (result.response === 'OK') {
        this.notifier.notify( 'success', 'OK: Configuración encuesta guardada.' );
      }
      this.fullLoading = false;
    },
    error => {
      this.notifier.notify( 'error', 'ERROR: Error al guardar la configuracón de la encuesta.' );
      this.fullLoading = false;
    });
  }

}
