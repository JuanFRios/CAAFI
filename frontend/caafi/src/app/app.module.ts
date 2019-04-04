import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MaterialModule } from './material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlexLayoutModule } from '@angular/flex-layout';
import { LoadingModule } from 'ngx-loading';
import { OwlDateTimeModule, OwlNativeDateTimeModule, OwlDateTimeIntl } from 'ng-pick-datetime';

import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { GenericTableModule } from 'angular-generic-table';
import { FormlyModule } from '@ngx-formly/core';
import { FormlyMaterialModule } from '@ngx-formly/material';
import { FormlyMatDatepickerModule } from '@ngx-formly/material/datepicker';
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

import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { TooltipWrapperComponent } from './components/wrappers/tooltip/tooltip-wrapper.component';

import { AppComponent } from './app.component';
import { SafePipe } from './safe.pipe';
import { MenuComponent } from './components/menu/menu.component';
import { MenuItemComponent } from './components/menu/menu-item/menu-item.component';
import { FormlyComponent } from './components/formly/formly.component';
import { MatProgressButtonsModule } from 'mat-progress-buttons';
import { RouterModule } from '../../node_modules/@angular/router';
import { NotifierModule } from 'angular-notifier';
import { DataTableComponent } from './components/data-table/data-table.component';
import { UtilService } from './services/util.service';
import { PollsComponent } from './components/polls/polls.component';
import { ContainerComponent } from './components/container/container.component';
import { ExcelService } from './services/excel.service';
import { RequestCache } from './services/request-cache.service';
import { CachingInterceptor } from './services/caching-interceptor.interceptor';

// here is the default text string
export class DefaultIntl extends OwlDateTimeIntl {
  /** A label for the up second button (used by screen readers).  */
  upSecondLabel = 'Add a second';

  /** A label for the down second button (used by screen readers).  */
  downSecondLabel = 'Minus a second';

  /** A label for the up minute button (used by screen readers).  */
  upMinuteLabel = 'Add a minute';

  /** A label for the down minute button (used by screen readers).  */
  downMinuteLabel = 'Minus a minute';

  /** A label for the up hour button (used by screen readers).  */
  upHourLabel = 'Add a hour';

  /** A label for the down hour button (used by screen readers).  */
  downHourLabel = 'Minus a hour';

  /** A label for the previous month button (used by screen readers). */
  prevMonthLabel = 'Previous month';

  /** A label for the next month button (used by screen readers). */
  nextMonthLabel = 'Next month';

  /** A label for the previous year button (used by screen readers). */
  prevYearLabel = 'Previous year';

  /** A label for the next year button (used by screen readers). */
  nextYearLabel = 'Next year';

  /** A label for the previous multi-year button (used by screen readers). */
  prevMultiYearLabel = 'Previous 21 years';

  /** A label for the next multi-year button (used by screen readers). */
  nextMultiYearLabel = 'Next 21 years';

  /** A label for the 'switch to month view' button (used by screen readers). */
  switchToMonthViewLabel = 'Change to month view';

  /** A label for the 'switch to year view' button (used by screen readers). */
  switchToMultiYearViewLabel = 'Choose month and year';

  /** A label for the cancel button */
  cancelBtnLabel = 'Cancelar';

  /** A label for the set button */
  setBtnLabel = 'OK';

  /** A label for the range 'from' in picker info */
  rangeFromLabel = 'Desde';

  /** A label for the range 'to' in picker info */
  rangeToLabel = 'Hasta';

  /** A label for the hour12 button (AM) */
  hour12AMLabel = 'AM';

  /** A label for the hour12 button (PM) */
  hour12PMLabel = 'PM';
}

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
    ContainerComponent,
    HomeComponent,
    EvaluationComponent,
    VariableTypeComponent,
    RepeatTypeComponent,
    FileValueAccessor,
    FormlyFieldFileComponent,
    TooltipWrapperComponent,
    SafePipe
  ],
  imports: [
    BrowserModule,
    MatProgressButtonsModule,
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    GenericTableModule,
    FormlyModule.forRoot({
      types: [
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
    FormlyMatDatepickerModule,
    FormlyMaterialModule,
    BrowserAnimationsModule,
    MaterialModule,
    AppRoutingModule,
    LoadingModule,
    HttpClientModule,
    RestangularModule.forRoot(RestangularConfigFactory),
    RouterModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
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
      UtilService,
      ExcelService,
      { provide: OwlDateTimeIntl, useClass: DefaultIntl },
      RequestCache,
      { provide: HTTP_INTERCEPTORS, useClass: CachingInterceptor, multi: true }
  ],
  bootstrap: [AppComponent],
  entryComponents: [DataTableComponent]
})
export class AppModule { }
