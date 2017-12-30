import { FormlyFieldConfig } from '@ngx-formly/core';

export class Template {
  id: string;
  name: string;
  version: number;
  fields: Array<FormlyFieldConfig>;
}
