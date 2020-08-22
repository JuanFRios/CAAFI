import { FormlyFieldConfig } from '@ngx-formly/core';
import { Resource } from '../resource';

export interface Form extends Resource {
  name: string;
  title: string;
  fields: FormlyFieldConfig[];
}
