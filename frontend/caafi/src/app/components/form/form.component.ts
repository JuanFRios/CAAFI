import { Component, OnInit, ViewEncapsulation, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormlyFieldConfig, FormlyFormOptions } from '@ngx-formly/core';
import { MatProgressButtonOptions } from 'mat-progress-buttons';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { FormService } from '../../services/form.service';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class FormComponent implements OnInit, OnDestroy {

  @Input() formName: string;
  @Input() model;
  @Input() buttonText;
  @Input() cleanButton = false;
  @Output() submited = new EventEmitter();

  form = new FormGroup({});
  fields: FormlyFieldConfig[] = [];
  options: FormlyFormOptions = {};
  formSubscription: Subscription;
  formFormalName = '';
  routeSubscription: Subscription;
  id: string;
  btnSaveOpts: MatProgressButtonOptions;
  btnCleanOpts: MatProgressButtonOptions;

  constructor(
    private formService: FormService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {

    this.btnSaveOpts = {
      active: false,
      text: this.buttonText,
      spinnerSize: 19,
      raised: true,
      stroked: false,
      buttonColor: 'primary',
      spinnerColor: 'primary',
      fullWidth: false,
      disabled: true,
      mode: 'indeterminate',
    };

    this.btnCleanOpts = {
      active: false,
      text: 'Limpiar',
      spinnerSize: 19,
      raised: true,
      stroked: false,
      buttonColor: 'primary',
      spinnerColor: 'primary',
      fullWidth: false,
      disabled: false,
      mode: 'indeterminate',
    };

    if (this.formName) {
      this.loadForm(this.formName);
    } else {
      this.routeSubscription = this.route.paramMap.subscribe(params => {
        this.formName = params.get('form');
        this.id = params.get('id');
        this.loadForm(this.formName);
      });
    }
  }

  loadForm(form) {
    this.fields = this.formService.getFormFields(form);
    this.formFormalName = this.formService.getFormFormalName(form);
    this.getModel().then(model => {
      this.model = model;
    });

    // Enables save button when form value changes and is valid
    this.formSubscription = this.form.valueChanges.subscribe(() => {
      this.btnSaveOpts.disabled = !this.form.valid;
    });
  }

  getModel(): Promise<any> {
    return new Promise(resolve => {
      if (this.model) {
        resolve(this.model);
      } else {
        resolve(this.formService.getFormModel(this.formName));
      }
    });
  }

  submit(data) {
    this.btnSaveOpts.active = true;
    this.submited.emit(data);
  }

  saved(ok: boolean = true) {
    if (ok) {
      this.reset();
    }
    this.btnSaveOpts.active = false;
  }

  reset() {
    this.options.resetModel();
  }

  ngOnDestroy() {

    this.reset();

    if (this.formSubscription) {
      this.formSubscription.unsubscribe();
    }

    // Unsubscribe the form subscribers
    /*
    const formSubscribers = this.formService.getFormSubscribers(this.formName);
    if (formSubscribers) {
      formSubscribers.unsubscribe();
    }
    */

    if (this.routeSubscription) {
      this.routeSubscription.unsubscribe();
    }
  }

}
