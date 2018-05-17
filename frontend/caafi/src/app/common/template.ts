import { FormlyFormOptions, FormlyFieldConfig } from '@ngx-formly/core';

export class Template {
  id: string;
  name: string;
  version: number;
  options: FormlyFormOptions;
  fields: Array<FormlyFieldConfig>;
}
