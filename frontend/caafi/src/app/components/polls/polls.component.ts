import { Component, OnInit, ChangeDetectionStrategy, OnDestroy } from '@angular/core';
import { TemplatesService } from '../../services/templates.service';
import { Router, ActivatedRoute } from '@angular/router';
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
export class PollsComponent implements OnInit, OnDestroy {

  private readonly notifier: NotifierService;
  private emails: string;
  private subject: string;
  private message: string;
  private dateTimeRange: Date[];
  formId: string;
  formName: string;
  dependencyId: string;
  fullLoading: boolean;
  dependencyName: string;
  varFields;
  fields: any;
  template: any;
  public = false;
  navigationSubscription;
  pollType: string;

  constructor(
    private templatesService: TemplatesService,
    private utilService: UtilService,
    public loginService: LoginService,
    notifierService: NotifierService,
    public router: Router,
    private route: ActivatedRoute,
  ) {
    this.notifier = notifierService;
    this.fullLoading = false;
    this.varFields = {};
  }

  ngOnInit() {
    this.navigationSubscription = this.route.params.subscribe(params => {
      this.pollType = this.route.snapshot.paramMap.get('type');
      this.formId = this.route.snapshot.paramMap.get('form');
      this.dependencyId = this.route.snapshot.paramMap.get('dependency');
      if (this.formId != null) {
        this.loadTemplate(this.formId, true);
      }
    });
  }

  onSelectMenuItem($event) {
    if ($event.formId != null) {
      this.formId = $event.formId;
      this.dependencyName = $event.dependencyName;
      this.formName = $event.formName;
      this.dependencyId = $event.dependencyId;
      this.loadTemplate($event.formId, false);
    }
  }

  /**
   * Loads an specified template from DB
   */
  loadTemplate(formId, isPublic) {
    this.toggleLoading(true);

    if (!isPublic) {
      this.templatesService.getByName(formId)
      .subscribe(template => {
        this.utilService.loadTemplateFeatures(template, false);
        this.template = template;
        if (template.config != null) {
          this.emails = template.config['emails'];
          this.subject = template.config['subject'];
          this.message = template.config['message'];
          this.dateTimeRange = template.config['dateRange'];
        }
        this.toggleLoading(false);
      },
        error => {
          this.toggleLoading(false);
          this.notifier.notify( 'error', 'ERROR: Error al cargar el formulario.' );
        });
    } else {
      this.templatesService.getPublicTemplateByName(formId)
      .subscribe(template => {
        this.utilService.loadTemplateFeatures(template, false);
        this.template = template;
        if (template.config != null) {
          this.emails = template.config['emails'];
          this.subject = template.config['subject'];
          this.message = template.config['message'];
          this.dateTimeRange = template.config['dateRange'];
        }
        this.toggleLoading(false);
      },
        error => {
          this.toggleLoading(false);
          this.notifier.notify( 'error', 'ERROR: Error al cargar el formulario.' );
        });
    }
  }

  /**
   * Displays the loading
   */
  toggleLoading($event) {
    this.fullLoading = $event;
  }

  savePoll() {
    return new Promise(resolve => {
      this.fullLoading = true;
      const data: Template = new Template();
      data.name = this.formId;
      data.config = new Object();
      data.config['emails'] = this.emails;
      data.config['subject'] = this.subject;
      data.config['message'] = this.message;
      data.config['dateRange'] = this.dateTimeRange;
      data.config['url'] = httpBaseURL + '/encuestas/' + this.dependencyId + '/' + this.pollType + '/' + this.formId;
      this.templatesService.saveTemplateConfig(data)
      .subscribe(result => {
        if (result.response > 0) {
          this.notifier.notify( 'success', 'OK: Configuración encuesta guardada.' );
        }
        this.fullLoading = false;
        resolve();
      },
      error => {
        this.notifier.notify( 'error', 'ERROR: Error al guardar la configuracón de la encuesta.' );
        this.fullLoading = false;
      });
    });
  }

  saveAndSendPoll() {
    this.savePoll().then(result => {
      this.sendPoll();
    });
  }

  sendPoll() {
    this.fullLoading = true;
    this.templatesService.senTemplateByEmail(this.formName)
    .subscribe(result => {
      if (result.response === 'OK') {
        this.notifier.notify( 'success', 'OK: Encuesta enviada satisfactoriamente.' );
      }
      this.fullLoading = false;
    },
    error => {
      this.notifier.notify( 'error', 'ERROR: Error al enviar la encuesta.' );
      this.fullLoading = false;
    });
  }

  ngOnDestroy() {
    if (this.navigationSubscription) {
      this.navigationSubscription.unsubscribe();
    }
  }

}
