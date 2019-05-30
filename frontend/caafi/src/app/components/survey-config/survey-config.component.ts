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
    if ($event.formId != null) {
      this.formId = $event.formId;
      if (this.formId === 'encuesta-de-materias') {
        this.isMattersSurvery = true;
        this.configForm = this.formBuilder.group({
          emails: ['', Validators.required],
          subject: ['', Validators.required],
          message: ['', Validators.required],
          dateTimeRange: ['', Validators.required],
          allEmails: [true],
          emailsDB: [{value: '', disabled: true}]
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
      this.surveyType = this.route.snapshot.paramMap.get('type');
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

        if (this.isMattersSurvery) {
          this.getPrograms();
          this.loadConfigMattersSurvey();
        } else {
          this.loadConfigSurvey();
        }

        this.toggleLoading(false);
      },
        () => {
          this.toggleLoading(false);
          this.notifier.notify('error', 'ERROR: Error al cargar el formulario.');
        });
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

  loadMatters() {
    this.studentService.getMattersByProgram(this.program)
      .subscribe(result => {
        this.matters = result;
        this.matter = null;
        this.group = null;
        this.configId = this.dependencyId + '+' + this.surveyType + '+' + this.formId + '+' + this.program;
        this.refreshDataTable();
        this.cleanConfig();
      },
        () => {
          this.notifier.notify('error', 'ERROR: Error al traer las materias.');
        });
  }

  loadGroups() {
    this.studentService.getGroupsByProgramAndMatter(this.program, this.matter)
      .subscribe(result => {
        this.groups = result;
        this.group = null;
        this.configId = this.dependencyId + '+' + this.surveyType + '+' + this.formId
          + '+' + this.program + '+' + this.matter;
        this.refreshDataTable();
        this.cleanConfig();
      },
        () => {
          this.notifier.notify('error', 'ERROR: Error al traer los grupos de la materia.');
        });
  }

  cleanConfig() {
    if (this.isMattersSurvery) {
      this.configForm.setValue({
        allEmails: true,
        emailsDB: null,
        emails: null,
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
      this.toggleLoading(true);
      this.cleanConfig();
      this.configId = this.dependencyId + '+' + this.surveyType + '+' + this.formId;
      this.refreshDataTable();
      this.templatesService.getTemplateConfig(this.formId, this.configId)
        .subscribe(result => {
          if (result != null && result.config != null) {
            this.configForm.setValue({
              emails: result.config[0]['emails'],
              subject: result.config[0]['subject'],
              message: result.config[0]['message'],
              dateTimeRange: result.config[0]['dateRange']
            });
          }
          this.toggleLoading(false);
        },
          () => {
            this.notifier.notify('error', 'ERROR: Error al traer la configuración de la encuesta.');
            this.toggleLoading(false);
          });
    }
  }

  loadConfigMattersSurvey() {
    if (this.program != null && this.matter != null && this.group != null) {
      this.toggleLoading(true);
      this.cleanConfig();
      this.configId = this.dependencyId + '+' + this.surveyType + '+' + this.formId + '+'
        + this.program + '+' + this.matter + '+' + this.group;
      this.templatesService.getTemplateConfig(this.formId, this.configId)
        .subscribe(result => {
          if (result != null && result.config != null) {
            console.log(this.configForm);
            this.configForm.controls['emails'].setValue(result.config[0]['emails']);
            this.configForm.controls['subject'].setValue(result.config[0]['subject']);
            this.configForm.controls['message'].setValue(result.config[0]['message']);
            this.configForm.controls['dateTimeRange'].setValue(result.config[0]['dateRange']);
          }
          this.toggleLoading(false);
        },
          () => {
            this.notifier.notify('error', 'ERROR: Error al traer la configuración de la encuesta.');
            this.toggleLoading(false);
          });
    } else {
      this.configId = this.dependencyId + '+' + this.surveyType + '+' + this.formId;
    }
    this.refreshDataTable();
    this.getEmailsDB();
  }

  cleanFilters() {
    this.program = null;
    this.matter = null;
    this.group = null;
    this.configId = this.dependencyId + '+' + this.surveyType + '+' + this.formId;
    this.refreshDataTable();
    this.cleanConfig();
  }

  getEmailsDB() {
    if (this.program != null && this.matter != null && this.group != null && !this.configForm.get('allEmails').value) {
      this.studentService.getEmailsByProgramAndMatterAndGroup(this.program, this.matter, this.group)
        .subscribe(result => {
          let emails = '';
          result.forEach((student) => {
            if (student['emailInstitu'] != null && student['emailInstitu'] !== '') {
              emails += student['emailInstitu'] + ',';
            }
            if (student['email'] != null && student['email'] !== '') {
              emails += student['email'] + ',';
            }
          });
          this.configForm.controls['emailsDB'].setValue(emails.substring(0, emails.length - 1));
        },
          () => {
            this.notifier.notify('error', 'ERROR: Error al traer los emails de los estudiantes.');
          });
    } else if (this.matter != null && this.group != null && this.configForm.get('allEmails').value) {
      this.studentService.getEmailsByMatterAndGroup(this.matter, this.group)
        .subscribe(result => {
          let emails = '';
          result.forEach((student) => {
            if (student['emailInstitu'] != null && student['emailInstitu'] !== '') {
              emails += student['emailInstitu'] + ',';
            }
            if (student['email'] != null && student['email'] !== '') {
              emails += student['email'] + ',';
            }
          });
          this.configForm.controls['emailsDB'].setValue(emails.substring(0, emails.length - 1));
        },
          () => {
            this.notifier.notify('error', 'ERROR: Error al traer los emails de los estudiantes.');
          });
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
        conf['emails'] = this.configForm.get('emails').value;
        conf['subject'] = this.configForm.get('subject').value;
        conf['message'] = this.configForm.get('message').value;
        conf['dateRange'] = this.configForm.get('dateTimeRange').value;
        conf['url'] = httpBaseURL + '/encuestas/' + this.dependencyId + '/' + this.surveyType + '/'
          + this.formId + '/' + this.program + '/' + this.matter + '/' + this.group;
        conf['program'] = this.program;
        conf['matter'] = this.matter;
        conf['group'] = this.group;
        conf['allEmails'] = this.configForm.get('allEmails').value;
        conf['configId'] = this.dependencyId + '+' + this.surveyType + '+' + this.formId + '+'
          + this.program + '+' + this.matter + '+' + this.group;
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
          this.notifier.notify('success', 'OK: Encuesta enviada satisfactoriamente.');
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

  ngOnDestroy() {
    if (this.navigationSubscription) {
      this.navigationSubscription.unsubscribe();
    }
  }

}
