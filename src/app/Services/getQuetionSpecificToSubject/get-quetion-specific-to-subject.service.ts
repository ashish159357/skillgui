import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Quetion } from 'src/app/model/Quetion/quetion';
import { GlobalConstants } from 'src/app/Constants/global-constants';

@Injectable({
  providedIn: 'root'
})
export class GetQuetionSpecificToSubjectService {

  private getquetionurl: string = GlobalConstants.apiURL + '/api/v1/quetions/';

  constructor(private http: HttpClient) {}

  public getQuetion(su:string){
    return this.http.get<Quetion[]>(this.getquetionurl + su);
  }

}
