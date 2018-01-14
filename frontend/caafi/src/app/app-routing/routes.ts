import { Routes } from '@angular/router';
import { TemplatesComponent } from '../components/templates/templates.component';
import { HomeComponent } from '../components/home/home.component';
export const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'formularios', component: TemplatesComponent }
];
