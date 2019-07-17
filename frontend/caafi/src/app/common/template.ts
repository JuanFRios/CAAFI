import { FormlyFieldConfig } from '@ngx-formly/core';

export class Template {
  id: string;
  name: string;
  version: number;
  variables: Object;
  fields: Array<FormlyFieldConfig>;
  table: String[];
  report: Array<FormlyFieldConfig>;
  config: Object;
  isPublic: boolean;
}
