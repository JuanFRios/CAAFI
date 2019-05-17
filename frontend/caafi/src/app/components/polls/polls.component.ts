import { Component, OnInit, ChangeDetectionStrategy, OnDestroy } from '@angular/core';
import { TemplatesService } from '../../services/templates.service';
import { Router, ActivatedRoute } from '@angular/router';
import { httpBaseURL } from '../../common/baseurl';
import { UtilService } from '../../services/util.service';
import { NotifierService } from 'angular-notifier';
import { LoginService } from '../../services/login.service';
import { Template } from '../../common/template';
import { StudentService } from '../../services/student.service';
import { RequestCache } from '../../services/request-cache.service';
import { Student } from '../../common/student';

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
  formData: Object = null;
  isMattersSurvery = false;
  programs = [];
  program = null;
  matters = [];
  matter = null;
  groups = [];
  group = null;
  emailsDB = null;
  allEmails = true;
  configId = null;

  constructor(
    private templatesService: TemplatesService,
    private utilService: UtilService,
    public loginService: LoginService,
    private studentService: StudentService,
    notifierService: NotifierService,
    public router: Router,
    private route: ActivatedRoute,
    private requestCache: RequestCache
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
      if (this.formId === 'encuesta-de-materias') {
        this.isMattersSurvery = true;
      }
      this.dependencyName = $event.dependencyName;
      this.formData = new Object();
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
        /*
        if (template.config != null) {
          this.emails = template.config['emails'];
          this.subject = template.config['subject'];
          this.message = template.config['message'];
          this.dateTimeRange = template.config['dateRange'];
          this.program = template.config['program'];
          if (this.program != null) {
            this.loadMatters();
          }
          this.matter = template.config['matter'];
        }
        */
        if (this.isMattersSurvery) {
          this.getPrograms();
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
        /*
        if (template.config != null) {
          this.emails = template.config['emails'];
          this.subject = template.config['subject'];
          this.message = template.config['message'];
          this.dateTimeRange = template.config['dateRange'];
        }
        */
        this.toggleLoading(false);
      },
        error => {
          this.toggleLoading(false);
          this.notifier.notify( 'error', 'ERROR: Error al cargar el formulario.' );
        });
    }
  }

  getPrograms() {
    this.studentService.getPrograms()
      .subscribe(result => {
        this.programs = result;
        this.program = null;
        this.matter = null;
        this.group = null;
        this.loadConfig();
      },
    error => {
      this.notifier.notify( 'error', 'ERROR: Error al traer los programas académicos.' );
    });
  }

  loadMatters() {
    this.studentService.getMattersByProgram(this.program)
      .subscribe(result => {
        this.matters = result;
        this.matter = null;
        this.group = null;
        this.loadConfig();
      },
    error => {
      this.notifier.notify( 'error', 'ERROR: Error al traer las materias.' );
    });
  }

  loadGroups() {
    this.studentService.getGroupsByProgramAndMatter(this.program, this.matter)
      .subscribe(result => {
        this.groups = result;
        this.group = null;
        this.loadConfig();
      },
    error => {
      this.notifier.notify( 'error', 'ERROR: Error al traer los grupos de la materia.' );
    });
  }

  loadConfig() {
    this.emails = null;
    this.subject = null;
    this.message = null;
    this.dateTimeRange = null;
    this.emailsDB = null;
    if (this.program != null && this.matter != null && this.group != null) {
      this.toggleLoading(true);
      this.templatesService.getTemplateConfig(this.formId, this.program + '-' + this.matter + '-' + this.group)
        .subscribe(result => {
          if (result != null && result.config != null) {
            this.emails = result.config[0]['emails'];
            this.subject = result.config[0]['subject'];
            this.message = result.config[0]['message'];
            this.dateTimeRange = result.config[0]['dateRange'];
          }
          this.toggleLoading(false);
        },
        error => {
          this.notifier.notify( 'error', 'ERROR: Error al traer la configuración de la encuesta.' );
          this.toggleLoading(false);
        });
    }
    this.getEmailsDB();
  }

  getEmailsDB() {
    if (this.program != null && this.matter != null && this.group != null && !this.allEmails) {
      this.studentService.getEmailsByProgramAndMatterAndGroup(this.program, this.matter, this.group)
        .subscribe(result => {
          this.emailsDB = '';
          result.forEach( (student) => {
            this.emailsDB += student['emailInstitu'] + ',';
          });
          this.emailsDB = this.emailsDB.substring(0, this.emailsDB.length - 1);
        },
        error => {
          this.notifier.notify( 'error', 'ERROR: Error al traer los emails de los estudiantes.' );
        });
    } else if (this.matter != null && this.group != null && this.allEmails) {
      this.studentService.getEmailsByMatterAndGroup(this.matter, this.group)
        .subscribe(result => {
          this.emailsDB = '';
          result.forEach( (student) => {
            this.emailsDB += student['emailInstitu'] + ',';
          });
          this.emailsDB = this.emailsDB.substring(0, this.emailsDB.length - 1);
        },
        error => {
          this.notifier.notify( 'error', 'ERROR: Error al traer los emails de los estudiantes.' );
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
      data.config = new Array();
      if (this.isMattersSurvery) {
        const conf = new Object();
        conf['emails'] = this.emails;
        conf['subject'] = this.subject;
        conf['message'] = this.message;
        conf['dateRange'] = this.dateTimeRange;
        conf['url'] = httpBaseURL + '/encuestas/' + this.formId + '/' + this.program + '/' + this.matter + '/' + this.group;
        conf['program'] = this.program;
        conf['matter'] = this.matter;
        conf['group'] = this.group;
        conf['configId'] = this.program + '-' + this.matter + '-' + this.group;
        this.configId = this.program + '-' + this.matter + '-' + this.group;
        data.config.push(conf);
      } else {
        data.config['emails'] = this.emails;
        data.config['subject'] = this.subject;
        data.config['message'] = this.message;
        data.config['dateRange'] = this.dateTimeRange;
        data.config['url'] = httpBaseURL + '/encuestas/' + this.dependencyId + '/' + this.pollType + '/' + this.formId;
      }
      this.templatesService.saveTemplateConfig(data)
      .subscribe(result => {
        if (result.response > 0) {
          this.requestCache.remove('template/config/' + this.formId + '/' + this.program + '-' + this.matter + '-' + this.group);
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
    this.templatesService.senTemplateByEmail(this.formId, this.configId)
    .subscribe(result => {
      if (result.response === 'OK') {
        this.notifier.notify( 'success', 'OK: Encuesta enviada satisfactoriamente.' );
      } else {
        this.notifier.notify( 'warning', 'ADVERTENCIA: La encuesta no se envío.' );
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
