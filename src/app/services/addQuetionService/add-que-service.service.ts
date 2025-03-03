import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Addquetion } from 'src/app/model/AddQuetion/addquetion';
import { GlobalConstants } from 'src/app/constants/global-constants';

@Injectable({
  providedIn: 'root'
})
export class AddQueServiceService {

  private AddqueUrl: string = GlobalConstants.apiURL + '/api/v1/AddQue';

  constructor(private http: HttpClient) {}

  public save(AddQue:Addquetion) {
    return this.http.post<Addquetion>(this.AddqueUrl, AddQue);
  }
}
