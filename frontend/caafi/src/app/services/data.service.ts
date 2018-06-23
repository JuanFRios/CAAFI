import { Injectable } from '@angular/core';
import { Data } from '../common/data';
import { Dependency } from '../common/dependency';
import { Observable } from 'rxjs/Observable';
import { RestangularModule, Restangular } from 'ngx-restangular';

@Injectable()
export class DataService {

  constructor(private restangular: Restangular) { }

  getAll(): Observable<Data[]> {
    return this.restangular.all('data').getList();
  }

  getAllByTemplate(template: String): Observable<Data[]> {
    return this.restangular.all('data/bytemplate/' + template).getList();
  }

  getAllByTemplateAndDependency(template: string, dependency: string, allDataAccess: boolean, filter: string,
    sortColumn: string, sortOrder: string, pageNumber: number, pageSize: number,
    filters: string): Observable<Data[]> {

    let dependencyName = dependency;
    if (allDataAccess) {
      dependencyName = 'ALL';
    }
    return this.restangular.one('data/bytemplate/' + template
    + '?filter=' + filter + '&sortColumn=' + sortColumn + '&sortOrder=' + sortOrder + '&pageNumber='
    + pageNumber + '&pageSize=' + pageSize + '&filters=' + filters + '&dependency=' + dependencyName).get();
  }

  getByJson(json: string, fields: string): Observable<any[]> {
    return this.restangular.all('data/byJson/'
      + json + '/' + fields).getList();
  }

  getById(id: number): Observable<Data> {
    return this.restangular.one('data/byid', id).get();
  }

  save(data: Data): Observable<Data> {
    return this.restangular.all('data').post(data);
  }

  delete(id: number): Observable<Data> {
    return this.restangular.one('data/byid', id).remove();
  }

  count(template: string, dependency: string, allDataAccess: boolean, filter: string, filters: string): Observable<any> {
    let dependencyName = dependency;
    if (allDataAccess) {
      dependencyName = 'ALL';
    }
    return this.restangular.one('data/count/' + template + '?filter=' + filter
        + '&filters=' + filters + '&dependency=' + dependencyName).get();
  }

  processData(data, proccessedData, dataId, repeatSections, dates, booleans, namesRepeats) {
    for (const i in data) {
      if (typeof data[i] === 'object' && !repeatSections.includes(i)) {
        if (data[i] != null && data[i].id) {
          dataId = data[i].id;
        }
        this.processData(data[i], proccessedData, dataId, repeatSections,
          dates, booleans, namesRepeats);
        if (data[i] != null && data[i].constructor.name === 'Object' && !data[i]['data']) {
          data[i]['id'] = dataId;
          proccessedData.push(data[i]);
        }
      } else {
        if (dates.includes(i)) {
          const options: Intl.DateTimeFormatOptions = {
            year: 'numeric', month: '2-digit', day: '2-digit'
          };
          const date: Date = new Date(data[i]);
          data[i] = date.toLocaleDateString('ja-JP', options);
        } else if (booleans.includes(i)) {
          if (data[i]) {
            data[i] = 'Si';
          } else {
            data[i] = 'No';
          }
        } else if (repeatSections.includes(i)) {
          let dataRepeat = '';
          for (let j = 0; j < data[i].length; j++) {
            dataRepeat += '{ ';
            for (const k in data[i][j]) {
              if (typeof data[i][j][k] === 'object') {
                dataRepeat += namesRepeats[k] + ': ' + data[i][j][k].toString() + ', ';
              } else {
                dataRepeat += namesRepeats[k] + ': ' + data[i][j][k] + ', ';
              }
            }
            dataRepeat = dataRepeat.slice(0, -2) + ' }, <br><br>';
          }
          data[i] = dataRepeat.slice(0, -10);
        }
      }
    }
  }

  processDataReport(data, dataReport, proccessedData, dataId, repeatSections,
    dates, booleans, namesRepeats, columnsNames) {
    for (const i in data) {
      if (typeof data[i] === 'object' && data[i] && !repeatSections.includes(i)) {
        dataReport[i] = {};
        this.processDataReport(data[i], dataReport[i], proccessedData, dataId, repeatSections,
          dates, booleans, namesRepeats, columnsNames);
        if (data[i] != null && data[i].constructor.name === 'Object' && !data[i]['data']) {
          proccessedData.push(this.adjustData(dataReport[i], columnsNames));
        }
      } else {
        if (dates.includes(i)) {
          const options: Intl.DateTimeFormatOptions = {
            year: 'numeric', month: '2-digit', day: '2-digit'
          };
          const date: Date = new Date(data[i]);
          dataReport[columnsNames[i]] = date.toLocaleDateString('ja-JP', options);
        } else if (booleans.includes(i)) {
          if (data[i]) {
            dataReport[columnsNames[i]] = 'Si';
          } else {
            dataReport[columnsNames[i]] = 'No';
          }
        } else if (repeatSections.includes(i)) {
          let dataRepeat = '';
          for (let j = 0; j < data[i].length; j++) {
            dataRepeat += '{ ';
            for (const k in data[i][j]) {
              if (typeof data[i][j][k] === 'object') {
                dataRepeat += namesRepeats[k] + ': ' + data[i][j][k].toString() + ', ';
              } else {
                dataRepeat += namesRepeats[k] + ': ' + data[i][j][k] + ', ';
              }
            }
            dataRepeat = dataRepeat.slice(0, -2) + ' }, ';
          }
          dataReport[columnsNames[i]] = dataRepeat.slice(0, -2);
        } else if (columnsNames[i] && {}.toString.call(columnsNames[i]) !== '[object Function]') {
          if (data[i] == null) {
            dataReport[columnsNames[i]] = '';
          } else {
            dataReport[columnsNames[i]] = data[i];
          }
        }
      }
    }
  }

  adjustData(data, keys) {
    const newData = {};
    for (const i in keys) {
      if (data[keys[i]]) {
        newData[keys[i]] = data[keys[i]];
      } else {
        newData[keys[i]] = '';
      }
    }
    return newData;
  }

}
