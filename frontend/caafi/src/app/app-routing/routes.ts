import { Routes } from '@angular/router';
import { TemplatesComponent } from '../components/templates/templates.component';
import { EvaluationComponent } from '../components/evaluation/evaluation.component';
import { HomeComponent } from '../components/home/home.component';
import { LoginService as AuthGuard } from '../services/login.service';
import { PollsComponent } from '../components/polls/polls.component';

export const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'formularios', component: TemplatesComponent, canActivate: [AuthGuard] },
  { path: 'formularios/:dependency/:form', component: TemplatesComponent, canActivate: [AuthGuard] },
  { path: 'reportes', component: TemplatesComponent, canActivate: [AuthGuard] },
  { path: 'autoevaluacion', component: EvaluationComponent, canActivate: [AuthGuard] },
  { path: 'encuestas', component: PollsComponent, canActivate: [AuthGuard] },
  { path: 'encuestas/:dependency/:form', component: PollsComponent },
  { path: '**', redirectTo: 'formularios' },
];
