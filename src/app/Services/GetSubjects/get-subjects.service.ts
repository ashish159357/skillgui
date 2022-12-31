import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'src/app/model/Subjects/subject';


@Injectable({
  providedIn: 'root'
})
export class GetSubjectsService {

  private getsubjectsurl:string;

  constructor(private http: HttpClient) {
    this.getsubjectsurl='http://localhost:8081/subjects'
   }

   public findSubjects(){
     console.log("service :",this.http.get<Subject[]>(this.getsubjectsurl))
      return this.http.get<Subject[]>(this.getsubjectsurl);
   }
}
