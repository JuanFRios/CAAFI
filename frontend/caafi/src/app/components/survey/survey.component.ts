import { Component, OnInit, OnDestroy } from '@angular/core';
import { TemplatesService } from '../../services/templates.service';
import { ActivatedRoute } from '@angular/router';
import { UtilService } from '../../services/util.service';
import { NotifierService } from 'angular-notifier';
import { StudentService } from '../../services/student.service';
import { DataService } from '../../services/data.service';
import { ConfigService } from '../../services/config.service';

@Component({
  selector: 'app-survey',
  templateUrl: './survey.component.html',
  styleUrls: ['./survey.component.css']
})
export class SurveyComponent implements OnInit, OnDestroy {

  private readonly notifier: NotifierService;
  fullLoading: boolean;
  formId: string;
  dependency: string;
  type: string;
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
  formlyName = null;
  dependencyName = null;
  semester = null;

  constructor(
    private templatesService: TemplatesService,
    private utilService: UtilService,
    private notifierService: NotifierService,
    private route: ActivatedRoute,
    private studentService: StudentService,
    private dataService: DataService,
    private configService: ConfigService
  ) {
    this.notifier = notifierService;
    this.fullLoading = false;
  }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.formId = params.get('form');
      this.dependency = params.get('dependency');
      this.type = params.get('type');
      if (this.formId != null && this.dependency != null && this.type != null) {
        // nombre de dependencia
        this.configService.getDependencyFormalName(this.dependency).subscribe(depenendcyName => {
          this.dependencyName = depenendcyName['formalName'];
        });

        // Validar formulario, dependencia y tipo
        if (this.formId === 'encuesta-de-materias') {
          this.semester = params.get('semester');
          this.program = params.get('program');
          this.matter = params.get('matter');
          this.group = params.get('group');
          this.cedula = params.get('cedula');
          if (this.semester != null && this.program != null && this.matter != null && this.group != null) {
            this.formlyName = this.dependency + '+' + this.type + '+' + this.formId
              + '+' + this.program + '+' + this.matter + '+' + this.group;
            this.formData['semestre'] = this.semester;
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
              this.isError = true;
            }
          }
        } else {
          this.formlyName = this.dependency + '+' + this.type + '+' + this.formId;
          this.dataLoaded = true;
          this.loadTemplate();
        }
      }
    });
  }

  validateRegister() {
    return new Promise(resolve => {
      this.dataService.getDataByFormAndCreator(this.dependency + '+' + this.type + '+' + this.formId + '+'
        + this.program + '+' + this.matter + '+' + this.group, this.cedula, this.semester)
      .subscribe(result => {
        resolve(result['present']);
      },
      error => {
        this.isError = true;
        this.notifier.notify( 'error', 'ERROR: 1' ); // Error desconocido
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
      this.configService.getPublicConfigByName(this.dependency + '+' + this.type + '+' + this.formId)
        .subscribe(config => {
          const initDate = (new Date(config.value['dateRange'][0])).getTime();
          const endDate = (new Date(config.value['dateRange'][1])).getTime();
          const currDate = (new Date()).getTime();
          if ((this.formId === 'encuesta-de-materias' && currDate >= initDate && currDate <= endDate 
            && config.value['semester'] == this.semester) || (this.formId !== 'encuesta-de-materias' 
            && currDate >= initDate && currDate <= endDate)) {
            this.utilService.loadTemplateFeatures(template, false);
            this.template = template;
          } else {
            this.isSaved = true;
            this.message = 'Esta encuesta no esta disponible';
            this.notifier.notify( 'error', 'ERROR: 10' ); // La encuesta esta inhabilitada
          }
          this.toggleLoading(false);
        },
        error => {
          this.toggleLoading(false);
          this.isError = true;
          this.notifier.notify( 'error', 'ERROR: 11' ); // Error con la configuración
        });
    },
    error => {
      this.toggleLoading(false);
      this.isError = true;
      this.notifier.notify( 'error', 'ERROR: 2' ); // La encuesta no existe
    });
  }

  loadData() {
    this.loadProgram().then(result => {
      this.loadMatter().then(result2 => {
        if (this.cedula != null) {
          this.loadGroup().then(result3 => {
            console.log(this.formData);
            this.dataLoaded = true;
          });
        } else {
          this.validateGroup().then(result4 => {
            if (result4) {
              this.formData['grupo'] = this.group;
              console.log(this.formData);
              this.dataLoaded = true;
            } else {
              this.isError = true;
              this.notifier.notify( 'error', 'ERROR: 8' ); // El grupo no pertenece a la materia del programa
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
        this.notifier.notify( 'error', 'ERROR: 7' ); // Error desconocido
      });
    });
  }

  loadProgram() {
    return new Promise(resolve => {
      this.studentService.getProgramByCode(this.program)
      .subscribe(program => {
        this.formData['codigoProgramaAcademico'] = program.code;
        this.formData['programaAcademico'] = program.name;
        resolve();
      },
      error => {
        this.isError = true;
        this.notifier.notify( 'error', 'ERROR: 3' ); // El programa académico no existe
      });
    });
  }

  loadMatter() {
    return new Promise(resolve => {
      this.studentService.getMatterByCode(this.matter)
      .subscribe(matter => {
        this.formData['codigoCurso'] = matter.code;
        this.formData['nombreCurso'] = matter.name;
        resolve();
      },
      error => {
        this.isError = true;
        this.notifier.notify( 'error', 'ERROR: 4' ); // La materia no existe
      });
    });
  }

  loadGroup() {
    return new Promise(resolve => {
      this.studentService.getGrupoByStudentAndProgramAndMatter(this.cedula, this.program, this.matter)
      .subscribe(group => {
        if (group != null) {
          if (this.group !== group.code) {
            this.isError = true;
            this.notifier.notify( 'error', 'ERROR: 6' ); // El grupo en la url no corresponde al grupo en el que se encuetra el estudiante
          } else {
            this.formData['grupo'] = group.code;
            resolve();
          }
        } else {
          this.isError = true;
          this.notifier.notify( 'error', 'ERROR: 9' ); // El estudiante no pertenece a ningún grupo de la materia
        }
      },
      error => {
        this.isError = true;
        this.notifier.notify( 'error', 'ERROR: 5' ); // Error desconocido
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
