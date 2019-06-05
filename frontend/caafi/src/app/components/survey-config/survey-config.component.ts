import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { TemplatesService } from '../../services/templates.service';
import { Router, ActivatedRoute } from '@angular/router';
import { httpBaseURL } from '../../common/baseurl';
import { UtilService } from '../../services/util.service';
import { NotifierService } from 'angular-notifier';
import { LoginService } from '../../services/login.service';
import { Template } from '../../common/template';
import { StudentService } from '../../services/student.service';
import { RequestCache } from '../../services/request-cache.service';
import { DataTableComponent } from '../data-table/data-table.component';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-survey-config',
  templateUrl: './survey-config.component.html',
  styleUrls: ['./survey-config.component.css']
})
export class SurveyConfigComponent implements OnInit, OnDestroy {

  @ViewChild('dataTable') dataTable: DataTableComponent;

  private readonly notifier: NotifierService;
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
  surveyType: string;
  formData: Object = null;
  isMattersSurvery = false;
  programs = [];
  program = null;
  matters = [];
  matter = null;
  groups = [];
  group = null;
  configId = null;
  validConfig = false;
  configForm: FormGroup;
  filterInitDate = null;
  filterEndDate = null;
  allEmails = true;
  emailsDB = null;
  sendingProgressValue = 0;
  showProgress = false;
  progressMode = 'query';

  constructor(
    private templatesService: TemplatesService,
    private utilService: UtilService,
    public loginService: LoginService,
    private studentService: StudentService,
    notifierService: NotifierService,
    public router: Router,
    private route: ActivatedRoute,
    private requestCache: RequestCache,
    private formBuilder: FormBuilder
  ) {
    this.notifier = notifierService;
    this.fullLoading = false;
    this.varFields = {};
  }

  ngOnInit() {
    /*
    this.navigationSubscription = this.route.params.subscribe(params => {
      this.surveyType = this.route.snapshot.paramMap.get('type');
      this.formId = this.route.snapshot.paramMap.get('form');
      this.dependencyId = this.route.snapshot.paramMap.get('dependency');
      if (this.formId != null) {
        this.loadTemplate(this.formId);
      }
    });
    */
  }

  get f() { return this.configForm.controls; }

  onSelectMenuItem($event) {
    this.surveyType = this.route.snapshot.paramMap.get('type');
    if ($event.dependencyId != null && this.surveyType != null && $event.formId != null) {
      this.configId = $event.dependencyId + '+' + this.surveyType + '+' + $event.formId;
      this.formId = $event.formId;
      if (this.formId === 'encuesta-de-materias') {
        this.isMattersSurvery = true;
        this.configForm = this.formBuilder.group({
          subject: ['', Validators.required],
          message: ['', Validators.required],
          dateTimeRange: ['', Validators.required]
        });
      } else {
        this.isMattersSurvery = false;
        this.configForm = this.formBuilder.group({
          emails: ['', Validators.required],
          subject: ['', Validators.required],
          message: ['', Validators.required],
          dateTimeRange: ['', Validators.required]
        });
      }
      this.dependencyName = $event.dependencyName;
      this.formData = new Object();
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

    if (this.isMattersSurvery) {
      this.templatesService.getByName(formId)
      .subscribe(template => {
        this.utilService.loadTemplateFeatures(template, false);
        this.template = template;
        this.getPrograms();
        this.getMatters();
        this.loadConfigMattersSurvey(template['config'][0]);
        this.toggleLoading(false);
      },
        () => {
          this.toggleLoading(false);
          this.notifier.notify('error', 'ERROR: Error al cargar el formulario.');
        });
    } else {
      this.templatesService.getByName(formId)
      .subscribe(template => {
        this.utilService.loadTemplateFeatures(template, false);
        this.template = template;
        this.loadConfigSurvey();
        this.toggleLoading(false);
      },
        () => {
          this.toggleLoading(false);
          this.notifier.notify('error', 'ERROR: Error al cargar el formulario.');
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
      },
        () => {
          this.notifier.notify('error', 'ERROR: Error al traer los programas académicos.');
        });
  }

  getMatters() {
    this.studentService.getMatters()
      .subscribe(result => {
        this.matters = result;
        this.matter = null;
        this.group = null;
      },
        () => {
          this.notifier.notify('error', 'ERROR: Error al traer los programas académicos.');
        });
  }

  loadMatters() {
    this.configId = this.dependencyId + '+' + this.surveyType + '+' + this.formId + '+' + this.program;
    this.studentService.getMattersByProgram(this.program)
      .subscribe(result => {
        this.matters = result;
        this.matter = null;
        this.group = null;
      },
        () => {
          this.notifier.notify('error', 'ERROR: Error al traer las materias.');
        });
  }

  loadGroups() {
    if (this.program != null) {
      this.configId = this.dependencyId + '+' + this.surveyType + '+' + this.formId + '+' + this.program + '+' + this.matter;
      this.studentService.getGroupsByProgramAndMatter(this.program, this.matter)
        .subscribe(result => {
          this.groups = result;
          this.group = null;
        },
          () => {
            this.notifier.notify('error', 'ERROR: Error al traer los grupos de la materia.');
          });
    }
  }

  setGroup() {
    this.configId = this.dependencyId + '+' + this.surveyType + '+' + this.formId + '+'
        + this.program + '+' + this.matter + '+' + this.group;
  }

  cleanConfig() {
    if (this.isMattersSurvery) {
      this.allEmails = true;
      this.emailsDB = null;
      this.configForm.setValue({
        subject: null,
        message: null,
        dateTimeRange: null
      });
    } else {
      this.configForm.setValue({
        emails: null,
        subject: null,
        message: null,
        dateTimeRange: null
      });
    }
  }

  refreshDataTable() {
    if (this.dataTable != null) {
      this.dataTable.refresh(null);
    }
  }

  loadConfigSurvey() {
    if (this.formId != null && this.dependencyId != null && this.surveyType != null) {
      this.cleanConfig();
      this.configId = this.dependencyId + '+' + this.surveyType + '+' + this.formId;
      this.refreshDataTable();
      this.configForm.setValue({
        emails: this.template.config[0]['emails'],
        subject: this.template.config[0]['subject'],
        message: this.template.config[0]['message'],
        dateTimeRange: this.template.config[0]['dateRange']
      });
    }
  }

  loadConfigMattersSurvey(config) {
    this.cleanConfig();
    if (config != null ) {
      this.configForm.controls['subject'].setValue(config['subject']);
      this.configForm.controls['message'].setValue(config['message']);
      this.configForm.controls['dateTimeRange'].setValue(config['dateRange']);
      if (config['sending']) {
        this.showProgress = true;
        if (config['sending-percentage'] < 0) {
          this.progressMode = 'query';
        } else {
          this.progressMode = 'determinate';
          this.sendingProgressValue = config['sending-percentage'];
        }
        this.surveyProgress();
      } else {
        this.showProgress = false;
      }
    }
    this.refreshDataTable();
    this.getEmailsDB();
  }

  filterData() {
    const filters = new Object;
    if (this.filterInitDate != null) {
      filters['dage-savedDate'] = this.filterInitDate;
    }
    if (this.filterEndDate != null) {
      filters['dale-savedDate'] = this.filterEndDate;
    }

    this.dataTable.filters = encodeURIComponent(JSON.stringify(filters));

    if (this.isMattersSurvery) {
      this.getEmailsDB();
      if (this.program == null && this.matter != null) {
        this.configId = this.matter;
      }
    }

    this.refreshDataTable();
  }

  configFormValid() {
    return this.configForm.valid && !this.showProgress;
  }

  cleanFilters() {
    this.getMatters();
    this.groups = null;
    this.program = null;
    this.matter = null;
    this.group = null;
    this.filterInitDate = null;
    this.filterEndDate = null;
    this.configId = this.dependencyId + '+' + this.surveyType + '+' + this.formId;
    this.dataTable.dependencyName = this.configId;
    this.dataTable.filters = encodeURIComponent(JSON.stringify({}));
    this.refreshDataTable();
  }

  getEmailsDB() {
    if (!this.allEmails) {
      if (this.program != null && this.matter != null && this.group != null) {
        this.studentService.getEmailsByProgramAndMatterAndGroup(this.program, this.matter, this.group)
          .subscribe(result => {
            let emails = '';
            result.forEach((student) => {
              // Emails institucionales
              if (student['emailInstitucional'] != null && student['emailInstitucional'] !== '') {
                emails += student['emailInstitucional'] + ',';
              }
              // Emails personales
              /*
              if (student['email'] != null && student['email'] !== '') {
                emails += student['email'] + ',';
              }
              */
            });
            this.emailsDB = emails.substring(0, emails.length - 1);
          },
            () => {
              this.notifier.notify('error', 'ERROR: Error al traer los emails de los estudiantes.');
            });
      }
    } else {
      if (this.matter != null && this.group != null) {
        this.studentService.getEmailsByMatterAndGroup(this.matter, this.group)
          .subscribe(result => {
            let emails = '';
            result.forEach((student) => {
              // Emails institucionales
              if (student['emailInstitucional'] != null && student['emailInstitucional'] !== '') {
                emails += student['emailInstitucional'] + ',';
              }
              // Emails personales
              /*
              if (student['email'] != null && student['email'] !== '') {
                emails += student['email'] + ',';
              }
              */
            });
            this.emailsDB = emails.substring(0, emails.length - 1);
          },
            () => {
              this.notifier.notify('error', 'ERROR: Error al traer los emails de los estudiantes.');
            });
      }
    }
  }

  /**
   * Displays the loading
   */
  toggleLoading($event) {
    this.fullLoading = $event;
  }

  saveSurveyConfig() {
    return new Promise(resolve => {
      this.fullLoading = true;
      const data: Template = new Template();
      data.name = this.formId;
      data.config = new Array();
      const conf = new Object();
      if (this.isMattersSurvery) {
        conf['subject'] = this.configForm.get('subject').value;
        conf['message'] = this.configForm.get('message').value;
        conf['dateRange'] = this.configForm.get('dateTimeRange').value;
        conf['url'] = httpBaseURL + '/encuestas/' + this.dependencyId + '/' + this.surveyType + '/' + this.formId;
        conf['program'] = this.program;
        conf['matter'] = this.matter;
        conf['group'] = this.group;
        conf['configId'] = this.dependencyId + '+' + this.surveyType + '+' + this.formId;
      } else {
        conf['emails'] = this.configForm.get('emails').value;
        conf['subject'] = this.configForm.get('subject').value;
        conf['message'] = this.configForm.get('message').value;
        conf['dateRange'] = this.configForm.get('dateTimeRange').value;
        conf['url'] = httpBaseURL + '/encuestas/' + this.dependencyId + '/' + this.surveyType + '/' + this.formId + '/' + Date.now();
        conf['configId'] = this.dependencyId + '+' + this.surveyType + '+' + this.formId;
      }
      data.config.push(conf);
      this.templatesService.saveTemplateConfig(data)
        .subscribe(result => {
          if (result.response > 0) {
            this.requestCache.remove('template/config/' + this.formId + '/' + this.configId);
            this.notifier.notify('success', 'OK: Configuración encuesta guardada.');
          }
          this.fullLoading = false;
          resolve();
        },
          () => {
            this.notifier.notify('error', 'ERROR: Error al guardar la configuracón de la encuesta.');
            this.fullLoading = false;
          });
    });
  }

  saveConfigAndSendSurvey() {
    this.saveSurveyConfig().then(() => {
      this.sendSurvey();
    });
  }

  sendSurvey() {
    this.fullLoading = true;
    this.templatesService.senTemplateByEmail(this.formId, this.configId)
      .subscribe(result => {
        if (result.response === 'OK') {
          //this.notifier.notify('success', 'OK: Encuesta enviada satisfactoriamente.');
          this.showProgress = true;
          this.surveyProgress();

        } else {
          this.notifier.notify('warning', 'ADVERTENCIA: La encuesta no se envío.');
        }
        this.fullLoading = false;
      },
        () => {
          this.notifier.notify('error', 'ERROR: Error al enviar la encuesta.');
          this.fullLoading = false;
        });
  }

  surveyProgress() {
    const progressInterval = setInterval(() => {
      this.templatesService.getTemplateSendingProgress(this.formId).subscribe(result => {
        if (result['sending']) {
          this.showProgress = true;
          if (result['sending-percentage'] >= 0) {
            this.progressMode = 'determinate';
            this.sendingProgressValue = result['sending-percentage'];
          } else {
            this.progressMode = 'query';
          }
        } else {
          this.showProgress = false;
          this.progressMode = 'query';
          this.notifier.notify('success', 'OK: Encuesta enviada satisfactoriamente. Total enviados: ' + result['sended']);
          clearInterval(progressInterval);
        }
      });
    }, 2000);
  }

  ngOnDestroy() {
    if (this.navigationSubscription) {
      this.navigationSubscription.unsubscribe();
    }
  }

}
