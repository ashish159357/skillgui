import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'src/app/model/Subjects/subject';
import { GlobalConstants } from 'src/app/constants/global-constants';

@Injectable({
  providedIn: 'root'
})
export class GetSubjectsService {

  private getsubjectsurl: string = GlobalConstants.apiURL + "/api/v1/subjects";

  constructor(private http: HttpClient) {}

  public findSubjects() {
    return this.http.get<Subject[]>(this.getsubjectsurl);
  }
}
