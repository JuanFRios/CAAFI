import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { MaterialModule } from './material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlexLayoutModule } from '@angular/flex-layout';
import {
  MatButtonModule,
  MatToolbarModule,
  MatMenuModule
 } from '@angular/material';
import {MatSidenavModule} from '@angular/material/sidenav';

import { ReactiveFormsModule } from '@angular/forms';
import { FormlyModule } from '@ngx-formly/core';
import { FormlyMaterialModule } from '@ngx-formly/material';
import { DatepickerTypeComponent } from './components/types/datepicker/datepicker.component';
import { RepeatTypeComponent } from './components/types/repeat-section/repeat-section.component';

import { AppRoutingModule } from './app-routing/app-routing.module';

import { RestangularModule, Restangular } from 'ngx-restangular';
import { RestangularConfigFactory } from './common/restConfig';

import { TemplatesComponent } from './components/templates/templates.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';

import { TemplatesService } from './services/templates.service';
import { DataService } from './services/data.service';
import { ConfigService } from './services/config.service';

import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    TemplatesComponent,
    DatepickerTypeComponent,
    RepeatTypeComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    FlexLayoutModule,
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
      ]
    }),
    FormlyMaterialModule,
    BrowserAnimationsModule,
    MaterialModule,
    MatButtonModule,
    MatToolbarModule,
    MatMenuModule,
    MatSidenavModule,
    AppRoutingModule,
    RestangularModule.forRoot(RestangularConfigFactory)
  ],
  providers: [
      TemplatesService,
      DataService,
      ConfigService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
