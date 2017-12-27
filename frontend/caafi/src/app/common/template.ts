import { FormlyFieldConfig } from '@ngx-formly/core';

export class Template {
  id: number;
  name: string;
  version: string;
  fields: Array<FormlyFieldConfig>;

  constructor(id?: number, name?: string, version?: string, fields?: Array<FormlyFieldConfig>){
    this.id = id;
    this.name = name;
    this.version = version;
    this.fields = fields;
  }
}
