import { Routes } from '@angular/router';
import { TemplatesComponent } from '../components/templates/templates.component';
import { EvaluationComponent } from '../components/evaluation/evaluation.component';
import { HomeComponent } from '../components/home/home.component';
import { LoginService as AuthGuard } from '../services/login.service';
import { SurveyConfigComponent } from '../components/survey-config/survey-config.component';
import { ReportComponent } from '../components/report/report.component';
import { SurveyComponent } from '../components/survey/survey.component';

export const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'formularios', component: TemplatesComponent, canActivate: [AuthGuard] },
  { path: 'formularios/:dependency/:form', component: TemplatesComponent, canActivate: [AuthGuard] },
  { path: 'reportes', component: ReportComponent, canActivate: [AuthGuard] },
  { path: 'reportes/:form', component: ReportComponent, canActivate: [AuthGuard] },
  { path: 'reportes/:dependency/:form', component: ReportComponent, canActivate: [AuthGuard] },
  { path: 'autoevaluacion', component: EvaluationComponent, canActivate: [AuthGuard] },
  { path: 'autoevaluacion/:dependency', component: EvaluationComponent, canActivate: [AuthGuard] },
  { path: 'autoevaluacion/:dependency/informe-de-autoevaluacion', component: EvaluationComponent, canActivate: [AuthGuard] },
  { path: 'autoevaluacion/:dependency/:form', component: TemplatesComponent, canActivate: [AuthGuard] },
  { path: 'encuestas', component: SurveyConfigComponent, canActivate: [AuthGuard] },
  { path: 'encuestas/:dependency/:type/:form', component: SurveyConfigComponent, canActivate: [AuthGuard], pathMatch: 'full' },
  { path: 'encuestas/:dependency/:type/:form/:id', component: SurveyComponent },
  { path: 'encuestas/:dependency/:type/:form/:program/:matter/:group/:cedula', component: SurveyComponent },
  { path: '**', redirectTo: 'home' }
];
