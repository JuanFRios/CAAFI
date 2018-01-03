import { Routes } from '@angular/router';
import { TemplatesComponent } from '../components/templates/templates.component';

export const routes: Routes = [
  { path: ':id', component: TemplatesComponent }
];
