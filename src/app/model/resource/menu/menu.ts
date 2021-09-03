import { MenuItem } from './menu-item';
import { Resource } from '../resource';

export interface Menu extends Resource {
  label: string;
  menuItems: MenuItem[];
}
