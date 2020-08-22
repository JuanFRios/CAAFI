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
    return new Promise<void>((resolve) => {
      this.formService.findById(this.formId).subscribe((formResponse: Form) => {
        const promises = [];
        this.title = formResponse.title;
        this.fields = formResponse.fields.map(f => {
          f.fieldGroup = f.fieldGroup.map(fg => {
            switch(fg.type) {
              case 'autocomplete': {
                fg.templateOptions.filter = (term) => {
                  return this.formService.findListByName(fg.templateOptions.resource).pipe(
                    switchMap(response => {
                      return of(term ? this.filterListItems(term, response) : response.slice());
                    })
                  );
                }
                break;
              }
              case 'select': {
                if (fg.templateOptions.cascade) {
                  promises.push(new Promise<any>((resolveSelect) => {
                    this.formService.findListByName(fg.templateOptions.resource).subscribe(response => {
                      this.options.formState.selectOptionsData[fg.templateOptions.resource] = response
                        .map(listItem => ({
                          label: listItem[fg.templateOptions.itemName],
                          value: listItem[fg.templateOptions.itemName],
                          [fg.templateOptions.parentName]: listItem[fg.templateOptions.parentName]
                        }));
                      resolveSelect();
                    });
                  }));
                } else if (fg.templateOptions.resource) {
                  fg.templateOptions.options = this.formService.findListByName(fg.templateOptions.resource).pipe(
                    map(response => response.map(listItem => ({label: listItem, value: listItem})))
                  );
                } else if (fg.templateOptions.entity) {
                  fg.templateOptions.options = this.formService.findListByEntityName(fg.templateOptions.entity);
                }
                break;
              }
            }
            return fg;
          });
          return f;
        });
        Promise.all(promises).then(() => resolve());
      });
    });
  }

  private filterListItems(name: string, listItems: string[]) {
    return listItems.filter(listItem => listItem.toLowerCase().includes(name.toLowerCase()));
  }

  public abstract get formId(): string;

  public abstract submit(): void;
}
