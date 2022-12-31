import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Quetion } from 'src/app/model/Quetion/quetion';
import { GlobalConstants } from 'src/app/Constants/global-constants';

@Injectable({
  providedIn: 'root'
})
export class GetQuetionSpecificToSubjectService {

  private getquetionurl: string='/quetions/';
  apiUrl=GlobalConstants.apiURL;


  constructor(private http: HttpClient) {
    this.getquetionurl = this.apiUrl+'quetions/';
  }

  public getQuetion(su:string){
    return this.http.get<Quetion[]>(this.getquetionurl+su);
  }

}
