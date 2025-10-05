import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GetQuetionSpecificToSubjectService } from 'src/app/services/getQuetionSpecificToSubject/get-quetion-specific-to-subject.service';
import { Quetion } from 'src/app/model/Quetion/quetion';
import * as SockJs from 'sockjs-client';
import { environment } from 'src/environments/environment';
import * as Stomp from 'stompjs';

@Component({
  selector: 'app-start-game',
  templateUrl: './start-game.component.html',
  styleUrls: ['./start-game.component.css']
})
export class StartGameComponent implements OnInit {

  explanationofans: boolean | undefined;
  Quetions: Quetion[] | any = [];
  i = 0;
  Quetion: Quetion | any;
  selectedans = new Set();
  flag: boolean | undefined;
  gameId: any;
  stompclient: any;
  topicPrefix: any = '/topic/game/';
  response: any;

  constructor(private route: ActivatedRoute, private getquetionspecificTosubjectservice: GetQuetionSpecificToSubjectService)
  {
    this.explanationofans = false
  }

  ngOnInit(): void
  {
    this.gameId = this.route.snapshot.paramMap.get('gameId');
    this.createSocketConnection(this.topicPrefix + this.gameId);
  }

  createSocketConnection(topic:any){
    let ws = SockJs(environment.webSocketUrl);
    this.stompclient = Stomp.over(ws);
    const _this = this;
    _this.stompclient.connect({}, function (frame: any) {
      console.log("Connected : ", frame)
      _this.stompclient.subscribe(topic, function (response: any) {
        debugger
        _this.response = response;
        const parsed = JSON.parse(response.body);

        // Initialize object before setting properties
        _this.Quetion = {
          que: parsed.que,
          subject: parsed.subject,
          options: parsed.options,
          ans: parsed.ans,
          type: parsed.type
        };

      });
    })
  }

  setQuetions(data:any)
  {
    this.Quetions = data;
  }

  nextPage() {

    if (this.i < this.Quetions.length - 1) {
      this.i = this.i + 1;
      this.Quetion = this.Quetions[this.i];
    }

  }

  previousPage() {
    if (this.i > 0) {
      this.i = this.i - 1;
      this.Quetion = this.Quetions[this.i];
    }
  }

  checkAns(singleChoice: boolean, option: string, ans: String[], type: boolean) {

    if (type == true) {
      if (this.selectedans) {
        this.selectedans.clear();
      }
      this.selectedans.add(option);
    }


    if (singleChoice == true) {
      this.selectedans.add(option);
    }
    else {
      this.selectedans.delete(option);
    }
    console.log(this.selectedans);

  }

  resultOfQuetion(ans: String[]) {

    console.log(this.selectedans.size, ans.length)

    if (this.selectedans.size < ans.length || this.selectedans.size > ans.length) {
      this.flag = false;
    }
    else {
      for (var j = 0; j < ans.length; j++) {
        if (this.selectedans.has(ans[j])) {
          this.flag = true;
        }
        else {
          this.flag = false;
          break;
        }
      }
    }

    if (this.flag == true) {
      alert("ok");
    }
    else {
      alert("not ok");
    }
  }

  explanation() {
    if (this.explanationofans == true) {
      this.explanationofans = false;
    }
    else {
      this.explanationofans = true;
    }
  }
}
