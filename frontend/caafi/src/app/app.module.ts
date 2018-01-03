import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { MaterialModule } from './material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { ReactiveFormsModule } from '@angular/forms';
import { FormlyModule } from '@ngx-formly/core';
import { FormlyMaterialModule } from '@ngx-formly/material';
import { DatepickerTypeComponent } from './components/types/datepicker/datepicker.component';

import { AppRoutingModule } from './app-routing/app-routing.module';

import { RestangularModule, Restangular } from 'ngx-restangular';
import { RestangularConfigFactory } from './common/restConfig';

import { TemplatesComponent } from './components/templates/templates.component';
import { TemplatesService } from './services/templates.service';
import { DataService } from './services/data.service';

import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent,
    TemplatesComponent,
    DatepickerTypeComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
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
        }
      ]
    }),
    FormlyMaterialModule,
    BrowserAnimationsModule,
    MaterialModule,
    AppRoutingModule,
    RestangularModule.forRoot(RestangularConfigFactory)
  ],
  providers: [
      TemplatesService,
      DataService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
