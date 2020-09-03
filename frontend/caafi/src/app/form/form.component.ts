import { OnInit, Component } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormlyFormOptions, FormlyFieldConfig } from '@ngx-formly/core';
import { FormService } from '../service/form.service';
import { Form } from '../model/resource/form/form';
import { of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

@Component({
  template: `EMPTY`
})
export abstract class FormComponent implements OnInit {

  protected lists: { name: string, values: string[] }[];
  public form: FormGroup;
  public model: any;
  public options: FormlyFormOptions;
  public fields: FormlyFieldConfig[];
  public title: string;
  public loading: boolean;
  public promises: Promise<void>[];
  public showCancelButton: boolean;

  constructor(
    public formService: FormService
  ) {
    this.form = new FormGroup({});
    this.model = {};
    this.options = {
      formState: {
        selectOptionsData: {}
      }
    };
    this.lists = [];
    this.loading = true;
    this.formService.toggleLoading(true);
    this.promises = [];
    this.showCancelButton = true;
  }

  ngOnInit(): void {
    this.loadForm().then(() => {
      this.loading = false;
      this.formService.toggleLoading(false);
    });
  }

  public loadForm(): Promise<void> {
    return new Promise<void>(resolve => {
      this.formService.findById(this.formId).subscribe((formResponse: Form) => {
        this.title = formResponse.title;
        this.fields = formResponse.fields.map(f => this.processField(f));
        resolve();
      });
    });
  }

  private processField(field: FormlyFieldConfig) {
    if (field.fieldGroup) {
      field.fieldGroup = field.fieldGroup.map(subField => this.processField(subField));
    }
    if (field.fieldArray) {
      field.fieldArray = this.processField(field.fieldArray);
    }
    switch(field.type) {
      case 'select': {
        if (field.templateOptions.resource) {
          field.templateOptions.options = this.formService.findListById(field.templateOptions.resource).pipe(map(response => response.listItems));
        }
        break;
      }
    }
    return field;
  }

  public abstract get formId(): string;

  public abstract submit(): void;
}
