import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Addquetion } from 'src/app/model/AddQuetion/addquetion';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GameService {

  private creatgameUrl = environment.gameServiceUrl;

  constructor(private http: HttpClient) { }

  createGame(data:any){
    return this.http.post(this.creatgameUrl + "/v1/game/create/",data.value); 
  }
}
