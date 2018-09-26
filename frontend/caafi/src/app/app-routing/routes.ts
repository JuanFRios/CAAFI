import { Routes } from '@angular/router';
import { TemplatesComponent } from '../components/templates/templates.component';
import { EvaluationComponent } from '../components/evaluation/evaluation.component';
import { HomeComponent } from '../components/home/home.component';
import { LoginService as AuthGuard } from '../services/login.service';

export const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'formularios', component: TemplatesComponent, canActivate: [AuthGuard] },
  { path: 'reportes', component: TemplatesComponent, canActivate: [AuthGuard] },
  { path: 'autoevaluacion', component: EvaluationComponent, canActivate: [AuthGuard] },
  { path: 'encuestas', component: TemplatesComponent, canActivate: [AuthGuard] },
  { path: 'encuestas/:id', component: TemplatesComponent },
  { path: '**', redirectTo: 'formularios' },
];
