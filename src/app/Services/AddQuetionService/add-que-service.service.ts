import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Addquetion } from 'src/app/model/AddQuetion/addquetion';
import { GlobalConstants } from 'src/app/Constants/global-constants';

@Injectable({
  providedIn: 'root'
})
export class AddQueServiceService {

  private AddqueUrl: string ;
  apiUrl=GlobalConstants.apiURL;

  constructor(private http: HttpClient) {
      this.AddqueUrl=this.apiUrl+'AddQue';
  }
  
  public save(AddQue:Addquetion) {
    return this.http.post<Addquetion>(this.AddqueUrl, AddQue);
  }

  
}
