import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Config } from '../common/config';
import { RestangularModule, Restangular } from 'ngx-restangular';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { UtilService } from './util.service';
import { Program } from '../common/program';
import { Matter } from '../common/matter';
import { Group } from '../common/group';

@Injectable()
export class StudentService {

  constructor(
    private http: HttpClient,
    private utilService: UtilService,
    private restangular: Restangular) { }

  getPrograms(): Observable<Program[]> {
    return this.http.get<Program[]>('student/programs', this.utilService.getRequestOptions());
  }

  getMattersByProgram(program: string): Observable<Matter[]> {
    return this.http.get<Matter[]>('student/mattersByProgram/' + program, this.utilService.getRequestOptions());
  }

  getMatters(): Observable<Matter[]> {
    return this.http.get<Matter[]>('student/matters', this.utilService.getRequestOptions());
  }

  getGroupsByProgramAndMatter(program: string, matter: string): Observable<Group[]> {
    return this.http.get<Matter[]>('student/groupsByProgramAndMatter/' + program + '/' + matter, this.utilService.getRequestOptions());
  }

  getGroupsByMatter(matter: string): Observable<Group[]> {
    return this.http.get<Matter[]>('student/groupsByMatter/' + matter, this.utilService.getRequestOptions());
  }

  getEmailsByProgramAndMatterAndGroup(program: string, matter: string, group: string): Observable<string[]> {
    return this.http.get<string[]>('student/emailsByProgramAndMatterAndGroup/' + program + '/' + matter
      + '/' + group, this.utilService.getRequestOptions());
  }

  getEmailsByMatterAndGroup(matter: string, group: string): Observable<string[]> {
    return this.http.get<string[]>('student/emailsByMatterAndGroup/' + matter
      + '/' + group, this.utilService.getRequestOptions());
  }

  getProgramByCode(code: string): Observable<Program> {
    return this.http.get<Program>('student/public/programByCode/' + code, this.utilService.getRequestOptions());
  }

  getMatterByCode(code: string): Observable<Matter> {
    return this.http.get<Matter>('student/public/matterByCode/' + code, this.utilService.getRequestOptions());
  }

  getGrupoByStudentAndProgramAndMatter(student: string, program: string, matter: string): Observable<Group> {
    return this.http.get<Group>('student/public/groupByStudentAndProgramAndMatter/' + student + '/'
      + program + '/' + matter, this.utilService.getRequestOptions());
  }

  getGroupByProgramAndMatterAndGroup(program: string, matter: string, group: string): Observable<Group> {
    return this.restangular.one('student/public/getGroupByProgramAndMatterAndGroup/' + program + '/' + matter + '/' + group).get();
  }

}
