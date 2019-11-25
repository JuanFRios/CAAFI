import { Injectable } from '@angular/core';
import * as forms from '../components/form/forms';

@Injectable({
  providedIn: 'root'
})
export class FormService {

  constructor() { }

  getFormFields(formName: string) {
    return forms.formsMap[formName].form;
  }

  getFormModel(formName: string) {
    return forms.formsMap[formName].data;
  }

  getFormFormalName(formName: string) {
    return forms.formsMap[formName].name;
  }

  getFormSubscribers(formName: string) {
    return forms.formsMap[formName].subscribers;
  }

  getFormColumns(formName: string) {
    return forms.formsMap[formName].tableColumns;
  }

  getCollection(formName: string) {
    return forms.formsMap[formName].collection;
  }
}
