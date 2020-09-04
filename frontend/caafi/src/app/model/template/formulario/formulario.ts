import { Template } from "../template";
import { Resource } from '../../resource/resource';

export interface Formulario extends Template {
  tabla: Resource;
  formulario: Resource;
}