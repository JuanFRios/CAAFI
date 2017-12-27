import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing/app-routing.module';
import { RestangularModule, Restangular } from 'ngx-restangular';
import { RestangularConfigFactory } from './common/restConfig';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TemplatesComponent } from './components/templates/templates.component';
import { TemplatesService } from './services/templates.service';
import { MatButtonModule, MatCheckboxModule } from '@angular/material';
import { ReactiveFormsModule } from '@angular/forms';
import { FormlyModule } from '@ngx-formly/core';
import { FormlyMaterialModule } from '@ngx-formly/material';

@NgModule({
  declarations: [
    AppComponent,
    TemplatesComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    RestangularModule.forRoot(RestangularConfigFactory),
    BrowserAnimationsModule,
    MatButtonModule,
    MatCheckboxModule,
    ReactiveFormsModule,
    FormlyModule.forRoot(),
    FormlyMaterialModule
  ],
  providers: [
      TemplatesService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
