import { Component, OnInit, OnDestroy } from '@angular/core';
import { TemplatesService } from '../../services/templates.service';
import { ActivatedRoute } from '@angular/router';
import { UtilService } from '../../services/util.service';
import { NotifierService } from 'angular-notifier';
import { StudentService } from '../../services/student.service';
import { DataService } from '../../services/data.service';

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
  cedula = null;
  message = null;
  isSaved = false;
  isError = false;

  constructor(
    private templatesService: TemplatesService,
    private utilService: UtilService,
    private notifierService: NotifierService,
    private route: ActivatedRoute,
    private studentService: StudentService,
    private dataService: DataService
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
        this.cedula = this.route.snapshot.paramMap.get('cedula');
        if (this.program != null && this.matter != null && this.group != null) {
          if (this.cedula != null) {
            this.validateRegister().then(result => {
              if (result) {
                this.message = 'Usted ya realizó la encuesta, muchas gracias.';
                this.isSaved = true;
              } else {
                this.loadTemplate();
                this.loadData();
              }
            });
          } else {
            this.loadTemplate();
            this.loadData();
          }
        }
      }
    });
  }

  validateRegister() {
    return new Promise(resolve => {
      this.dataService.getDataByFormAndCreator(this.formId + '-' + this.program + '-' + this.matter + '-' + this.group, this.cedula)
      .subscribe(result => {
        resolve(result['present']);
      },
      error => {
        this.isError = true;
        this.notifier.notify( 'error', 'ERROR: 1' );
      });
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
      this.isError = true;
      this.notifier.notify( 'error', 'ERROR: 2' );
    });
  }

  loadData() {
    this.loadProgram().then(result => {
      this.loadMatter().then(result2 => {
        if (this.cedula != null) {
          this.loadGroup().then(result3 => {
            this.dataLoaded = true;
          });
        } else {
          this.validateGroup().then(result4 => {
            if (result4) {
              this.formData['grupo'] = this.group;
              this.dataLoaded = true;
            } else {
              this.isError = true;
              this.notifier.notify( 'error', 'ERROR: 8' );
            }
          });
        }
      });
    });
  }

  validateGroup() {
    return new Promise(resolve => {
      this.studentService.getGroupByProgramAndMatterAndGroup(this.program, this.matter, this.group)
      .subscribe(result => {
        resolve(result['present']);
      },
      error => {
        this.isError = true;
        this.notifier.notify( 'error', 'ERROR: 7' );
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
        this.isError = true;
        this.notifier.notify( 'error', 'ERROR: 3' );
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
        this.isError = true;
        this.notifier.notify( 'error', 'ERROR: 4' );
      });
    });
  }

  loadGroup() {
    return new Promise(resolve => {
      this.studentService.getGrupoByStudentAndProgramAndMatter(this.cedula, this.program, this.matter)
      .subscribe(group => {
        if (this.group !== group.code) {
          this.isError = true;
          this.notifier.notify( 'error', 'ERROR: 6' );
        } else {
          this.formData['grupo'] = group.code;
          resolve();
        }
      },
      error => {
        this.isError = true;
        this.notifier.notify( 'error', 'ERROR: 5' );
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

  saved() {
    this.message = 'Muchas gracias por tu respuesta.';
    this.isSaved = true;
  }

}
