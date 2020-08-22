import { Column } from './column';
import { Action } from './action';
import { Resource } from '../resource';

export interface Table extends Resource {
  name: string;
  title: string;
  columns: Column[];
  actions: Action[];
}
