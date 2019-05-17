import { Component, OnInit, OnDestroy } from '@angular/core';
import { TemplatesService } from '../../services/templates.service';
import { ActivatedRoute } from '@angular/router';
import { UtilService } from '../../services/util.service';
import { NotifierService } from 'angular-notifier';
import { StudentService } from '../../services/student.service';

@Component({
  selector: 'app-survey',
  templateUrl: './survey.component.html',
  styleUrls: ['./survey.component.css']
})
export class SurveyComponent implements OnInit, OnDestroy {

  private readonly notifier: NotifierService;
  fullLoading: boolean;
  formId: string;
  template: any;
  navigationSubscription;
  formData: Object = new Object();
  program = null;
  matter = null;
  group = null;
  dataLoaded = false;

  constructor(
    private templatesService: TemplatesService,
    private utilService: UtilService,
    private notifierService: NotifierService,
    private route: ActivatedRoute,
    private studentService: StudentService
  ) {
    this.notifier = notifierService;
    this.fullLoading = false;
  }

  ngOnInit() {
    this.navigationSubscription = this.route.params.subscribe(params => {
      this.formId = this.route.snapshot.paramMap.get('formId');
      if (this.formId != null && this.formId === 'encuesta-de-materias') {
        this.program = this.route.snapshot.paramMap.get('program');
        this.matter = this.route.snapshot.paramMap.get('matter');
        this.group = this.route.snapshot.paramMap.get('group');
        if (this.program != null && this.matter != null && this.group != null) {
          this.loadTemplate();
          this.loadData();
        }
      }
    });
  }

  /**
   * Loads an specified template from DB
   */
  loadTemplate() {
    this.toggleLoading(true);
    this.templatesService.getPublicTemplateByName(this.formId)
    .subscribe(template => {
      this.utilService.loadTemplateFeatures(template, false);
      this.template = template;
      this.toggleLoading(false);
    },
    error => {
      this.toggleLoading(false);
      this.notifier.notify( 'error', 'ERROR: Error al cargar la encuesta.' );
    });
  }

  loadData() {
    this.loadProgram().then(result => {
      this.loadMatter().then(result2 => {
        this.dataLoaded = true;
      });
    });
  }

  loadProgram() {
    return new Promise(resolve => {
      this.studentService.getProgramByCode(this.program)
      .subscribe(program => {
        this.formData['programaAcademico'] = program.name;
        resolve();
      },
      error => {
        this.notifier.notify( 'error', 'ERROR: Error al cargar el programa académico.' );
      });
    });
  }

  loadMatter() {
    return new Promise(resolve => {
      this.studentService.getMatterByCode(this.matter)
      .subscribe(matter => {
        this.formData['nombreCurso'] = matter.name;
        resolve();
      },
      error => {
        this.notifier.notify( 'error', 'ERROR: Error al cargar el programa académico.' );
      });
    });
  }

  /**
   * Displays the loading
   */
  toggleLoading($event) {
    this.fullLoading = $event;
  }

  ngOnDestroy() {
    if (this.navigationSubscription) {
      this.navigationSubscription.unsubscribe();
    }
  }

}
