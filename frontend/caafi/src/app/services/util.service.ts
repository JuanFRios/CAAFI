import { Injectable } from '@angular/core';

@Injectable()
export class UtilService {

  constructor() {}

  loadTemplateFeatures(template, activeActions = true) {
    template['displayedColumns'] = ['copy', 'edit', 'delete'];
    if (!activeActions) {
      template['displayedColumns'] = [];
    }
    template['displayedColumnsData'] = [];
    template['displayedColumnsNames'] = [];
    template['repeatSections'] = [];
    template['namesRepeats'] = {};
    template['dates'] = [];
    template['booleans'] = [];
    template['files'] = [];

    this.getTemplateFeatures(template, template.fields, ['key', 'type'], '');
  }

  getTemplateFeatures(template, fields, keys, path) {
    for (const i in fields) {
      if (typeof fields[i] === 'object') {
        this.getTemplateFeatures(template, fields[i], keys, path + '[\'' + i + '\']');
      } else if (this.arrayContains(i, keys)) {
        if (i === 'key' && !path.includes('fieldArray') && !path.includes('options')) {
          template.displayedColumns.push(fields[i]);
          template.displayedColumnsData.push(fields[i]);
          if (fields['type'] === 'repeat') {
            template.displayedColumnsNames[fields[i]] = fields.sectionName;
            template.repeatSections.push(fields[i]);
            for (const j of fields['fieldArray']['fieldGroup']) {
              template.namesRepeats[j.key] = j.templateOptions.label;
            }
          } else {
            template.displayedColumnsNames[fields[i]] = fields.templateOptions.label;
          }
        } else if (i === 'type' && fields[i] === 'datepicker') {
          template.dates.push(fields['key']);
        } else if (i === 'type' && fields[i] === 'checkbox') {
          template.booleans.push(fields['key']);
        } else if (i === 'type' && fields[i] === 'file') {
          template.files.push(fields['key']);
        }
      }
    }
  }

  arrayContains(needle, arrhaystack) {
    return (arrhaystack.indexOf(needle) > -1);
  }

  deepCopy(obj) {
    let copy;

    // Handle the 3 simple types, and null or undefined
    if (null == obj || 'object' !== typeof obj) {
      return obj;
    }

    // Handle Date
    if (obj instanceof Date) {
        copy = new Date();
        copy.setTime(obj.getTime());
        return copy;
    }

    // Handle Array
    if (obj instanceof Array) {
        copy = [];
        for (let i = 0, len = obj.length; i < len; i++) {
            copy[i] = this.deepCopy(obj[i]);
        }
        return copy;
    }

    // Handle Object
    if (obj instanceof Object) {
        copy = {};
        for (const attr in obj) {
            if (obj.hasOwnProperty(attr)) {
              copy[attr] = this.deepCopy(obj[attr]);
            }
        }
        return copy;
    }

    throw new Error('Unable to copy obj! Its type isnt supported.');
  }

}