import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormularioComponent } from './formulario/formulario.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { FlexLayoutModule } from '@angular/flex-layout';
import { LoginComponent } from './login/login.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCardModule } from '@angular/material/card';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule, MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { MatInputModule } from '@angular/material/input';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { AuthInterceptor } from './auth.interceptor';
import { ErrorInterceptor } from './error.interceptor';
import { HomeComponent } from './home/home.component';
import { SidenavComponent } from './sidenav/sidenav.component';
import { MatListModule } from '@angular/material/list';
import { MenuItemComponent } from './menu/menu-item/menu-item.component';
import { CreateComponent } from './table/data-table/create/create.component';
import { UpdateComponent } from './table/data-table/update/update.component';
import { SnackbarComponent } from './snackbar/snackbar.component';
import { MatDialogModule } from '@angular/material/dialog';
import { DialogComponent } from './dialog/dialog.component';
import { FormlyModule } from '@ngx-formly/core';
import { FormlyMaterialModule } from '@ngx-formly/material';
import { AutocompleteComponent } from './form/field-type/autocomplete/autocomplete.component';
import { RepeatComponent } from './form/field-type/repeat/repeat.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, MatPaginatorIntl } from '@angular/material/paginator';
import { getEsPaginatorIntl } from './util/es-paginator-intl';
import { MatSortModule } from '@angular/material/sort';
import { CRUD_INTERFACE } from './service/crud.interface';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { TemplateTableComponent } from './template-table/template-table.component';

@NgModule({
  declarations: [
    AppComponent,
    FormularioComponent,
    HeaderComponent,
    FooterComponent,
    LoginComponent,
    HomeComponent,
    SidenavComponent,
    MenuItemComponent,
    CreateComponent,
    UpdateComponent,
    SnackbarComponent,
    DialogComponent,
    AutocompleteComponent,
    RepeatComponent,
    TemplateTableComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    FlexLayoutModule,
    MatTooltipModule,
    MatCardModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    HttpClientModule,
    MatInputModule,
    MatListModule,
    MatDialogModule,
    FormlyModule.forRoot({
      types: [
        {
          name: 'autocomplete',
          component: AutocompleteComponent,
          wrappers: ['form-field']
        },
        {
          name: 'repeat',
          component: RepeatComponent
        }
      ],
      validationMessages: [
        { name: 'required', message: 'Este campo es obligatorio' }
      ]
    }),
    FormlyMaterialModule,
    MatAutocompleteModule,
    MatSnackBarModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatCheckboxModule
  ],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'es-CO' },
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { appearance: 'outline' } },
    { provide: MatPaginatorIntl, useValue: getEsPaginatorIntl() },
    { provide: CRUD_INTERFACE, useValue: {} },
    SnackbarComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
