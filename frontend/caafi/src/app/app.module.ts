import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MaterialModule } from './material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlexLayoutModule } from '@angular/flex-layout';
import {
  MatButtonModule,
  MatToolbarModule,
  MatMenuModule,
  MatTableModule,
  MatPaginatorModule,
  MatTooltipModule,
  MatSortModule,
  MatProgressBarModule
 } from '@angular/material';
import {MatSidenavModule} from '@angular/material/sidenav';
import { LoadingModule } from 'ngx-loading';

import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { GenericTableModule } from 'angular-generic-table';
import { FormlyModule } from '@ngx-formly/core';
import { FormlyMaterialModule } from '@ngx-formly/material';
import { DatepickerTypeComponent } from './components/types/datepicker/datepicker.component';
import { VariableTypeComponent } from './components/types/variable/variable.component';
import { RepeatTypeComponent } from './components/types/repeat-section/repeat-section.component';
import { FormlyFieldFileComponent } from './components/types/file-upload/file.component';
import { FileValueAccessor } from './components/types/file-upload/file-value-accessor';

import { AppRoutingModule } from './app-routing/app-routing.module';

import { RestangularModule, Restangular } from 'ngx-restangular';
import { RestangularConfigFactory } from './common/restConfig';

import { TemplatesComponent } from './components/templates/templates.component';
import { ReportComponent } from './components/report/report.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { HomeComponent } from './components/home/home.component';
import { EvaluationComponent } from './components/evaluation/evaluation.component';

import { TemplatesService } from './services/templates.service';
import { DataService } from './services/data.service';
import { ConfigService } from './services/config.service';
import { LoginService } from './services/login.service';
import { FileService } from './services/file.service';
import { ListService } from './services/list.service';

import { HttpClientModule } from '@angular/common/http';
import { HttpModule } from '@angular/http';
import { TooltipWrapperComponent } from './components/wrappers/tooltip/tooltip-wrapper.component';

import { AppComponent } from './app.component';
import { SafePipe } from './safe.pipe';
import { MenuComponent } from './components/menu/menu.component';
import { MenuItemComponent } from './components/menu/menu-item/menu-item.component';
import { FormlyComponent } from './components/formly/formly.component';
import { MatProgressButtons } from 'mat-progress-buttons';
import { RouterModule } from '../../node_modules/@angular/router';
import { NotifierModule } from 'angular-notifier';
import { DataTableComponent } from './components/data-table/data-table.component';
import { UtilService } from './services/util.service';
import { PollsComponent } from './components/polls/polls.component';

export function minlengthValidationMessage(err, field) {
  return `El campo ${field.templateOptions.label} debe contener al menos ${field.templateOptions.minLength} caracteres.`;
}

export function maxlengthValidationMessage(err, field) {
  return `El campo ${field.templateOptions.label} no puede contener más de ${field.templateOptions.maxLength} caracteres.`;
}

export function minValidationMessage(err, field) {
  return `El campo ${field.templateOptions.label} debe ser mayor a ${field.templateOptions.min}`;
}

export function maxValidationMessage(err, field) {
  return `El campo ${field.templateOptions.label} debe ser menor a ${field.templateOptions.max}`;
}
export function required(err, field) {
  return `El campo ${field.templateOptions.label} es requerido.`;
}

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    MenuComponent,
    MenuItemComponent,
    FormlyComponent,
    DataTableComponent,
    TemplatesComponent,
    PollsComponent,
    ReportComponent,
    HomeComponent,
    EvaluationComponent,
    DatepickerTypeComponent,
    VariableTypeComponent,
    RepeatTypeComponent,
    FileValueAccessor,
    FormlyFieldFileComponent,
    TooltipWrapperComponent,
    SafePipe
  ],
  imports: [
    BrowserModule,
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    GenericTableModule,
    FormlyModule.forRoot({
      types: [
        {
          name: 'datepicker',
          component: DatepickerTypeComponent,
          defaultOptions: {
            defaultValue: new Date(),
            templateOptions: {
              datepickerOptions: {}
            }
          }
        },
        { name: 'repeat', component: RepeatTypeComponent },
        { name: 'file', component: FormlyFieldFileComponent },
        {
          name: 'variable',
          component: VariableTypeComponent,
          defaultOptions: {
            defaultValue: '',
            templateOptions: {
              variableOptions: {}
            }
          }
        }
      ],
      validationMessages: [
        { name: 'required', message: required },
        { name: 'minlength', message: minlengthValidationMessage },
        { name: 'maxlength', message: maxlengthValidationMessage },
        { name: 'min', message: minValidationMessage },
        { name: 'max', message: maxValidationMessage },
      ],
      wrappers: [
        { name: 'tooltip', component: TooltipWrapperComponent },
      ],
    }),
    FormlyMaterialModule,
    BrowserAnimationsModule,
    MaterialModule,
    MatButtonModule,
    MatToolbarModule,
    MatMenuModule,
    MatTableModule,
    MatPaginatorModule,
    MatSidenavModule,
    MatSortModule,
    AppRoutingModule,
    MatTooltipModule,
    MatProgressBarModule,
    LoadingModule,
    HttpClientModule,
    HttpModule,
    RestangularModule.forRoot(RestangularConfigFactory),
    MatProgressButtons,
    RouterModule,
    NotifierModule.withConfig({
      position: {
        horizontal: {
          position: 'right',
          distance: 12
        },
        vertical: {
          position: 'top',
          distance: 12,
          gap: 10
        }
      }
    })
  ],
  providers: [
      TemplatesService,
      DataService,
      ConfigService,
      LoginService,
      FileService,
      ListService,
      UtilService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
