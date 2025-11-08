import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GetQuetionSpecificToSubjectService } from 'src/app/services/getQuetionSpecificToSubject/get-quetion-specific-to-subject.service';
import { Quetion } from 'src/app/model/Quetion/quetion';
import { WebSocketService, WebSocketMessage } from 'src/app/services/web-socket-service/web-socket.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-start-game',
  templateUrl: './start-game.component.html',
  styleUrls: ['./start-game.component.css']
})
export class StartGameComponent implements OnInit, OnDestroy {
  timeLimit: any;
  explanationofans: boolean | undefined;
  Quetions: Quetion[] | any = [];
  i = 0;
  Quetion: Quetion | any;
  selectedans = new Set();
  flag: boolean | undefined;
  gameId: any;
  topicPrefix: string = '/topic/game/';
  private webSocketSubscription?: Subscription;

  constructor(
    private route: ActivatedRoute,
    private getquetionspecificTosubjectservice: GetQuetionSpecificToSubjectService,
    private webSocketService: WebSocketService
  ) {
    this.explanationofans = false;
  }

  ngOnInit(): void {
    this.gameId = this.route.snapshot.paramMap.get('gameId');
    this.connectToGame(this.topicPrefix + this.gameId);
  }

  ngOnDestroy(): void {
    // Clean up WebSocket subscription when component is destroyed
    if (this.webSocketSubscription) {
      this.webSocketSubscription.unsubscribe();
    }
    this.webSocketService.unsubscribe(this.topicPrefix + this.gameId);
  }

  connectToGame(topic: string): void {
    // Connect to WebSocket and subscribe to game topic
    this.webSocketService.connect().then(() => {
      // Subscribe to the game topic
      this.webSocketSubscription = this.webSocketService.subscribe(topic).subscribe(
        (message: WebSocketMessage) => {
          this.handleWebSocketMessage(message);
        },
        (error) => {
          console.error('WebSocket subscription error:', error);
        }
      );

      // Send request to get players
      this.webSocketService.send(`/server/game/${this.gameId}`, 'game.get.players.request');
    }).catch((error) => {
      console.error('Failed to connect to WebSocket:', error);
    });
  }

  handleWebSocketMessage(message: WebSocketMessage): void {
    if (message.eventType === 'started') {
      const que = message.payload;

      // Initialize question object
      this.Quetion = {
        que: que.que,
        subject: que.subject,
        options: que.options,
        ans: que.ans,
        type: que.type
      };

      // Set time limit
      this.timeLimit = null;
      setTimeout(() => {
        this.timeLimit = message.payload.timeLimit;
      });
    }
    else if (message.eventType === 'game.get.players.response') {
      console.log('Players:', message.payload);
    }
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
