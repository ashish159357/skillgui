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

  // Game status and players
  gameStatus: string = 'connecting'; // 'connecting', 'waiting', 'started', 'ended'
  players: any[] = [];

  // Username prompt
  showUsernamePrompt: boolean = true;
  username: string = '';
  usernameError: string = '';
  isNewJoin: boolean = false; // Track if this is a fresh join (not a refresh)

  // Game control
  isHost: boolean = false; // Track if current user is the host

  constructor(
    private route: ActivatedRoute,
    private getquetionspecificTosubjectservice: GetQuetionSpecificToSubjectService,
    private webSocketService: WebSocketService
  ) {
    this.explanationofans = false;
  }

  ngOnInit(): void {
    this.gameId = this.route.snapshot.paramMap.get('gameId');

    // Check if username is already stored in session
    const storedUsername = sessionStorage.getItem(`game_${this.gameId}_username`);

    if (storedUsername) {
      this.username = storedUsername;
      this.showUsernamePrompt = false;
      this.connectToGame(this.topicPrefix + this.gameId);
    }
  }

  ngOnDestroy(): void {
    // Clean up WebSocket subscription when component is destroyed
    if (this.webSocketSubscription) {
      this.webSocketSubscription.unsubscribe();
    }
    this.webSocketService.unsubscribe(this.topicPrefix + this.gameId);
  }

  submitUsername(): void {
    // Validate username
    if (!this.username || this.username.trim().length === 0) {
      this.usernameError = 'Username is required';
      return;
    }

    if (this.username.trim().length < 3) {
      this.usernameError = 'Username must be at least 3 characters';
      return;
    }

    if (this.username.trim().length > 20) {
      this.usernameError = 'Username must be less than 20 characters';
      return;
    }

    // Store username in session storage
    sessionStorage.setItem(`game_${this.gameId}_username`, this.username.trim());

    // Mark this as a new join (not a refresh/reconnection)
    this.isNewJoin = true;

    // Hide prompt and connect to game
    this.showUsernamePrompt = false;
    this.usernameError = '';
    this.connectToGame(this.topicPrefix + this.gameId);
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

      // Send request to get game status
      this.webSocketService.send(`/server/game/${this.gameId}`, 'game.get.status.request');

      // Send player joined request ONLY if this is a new join (not a refresh)
      if (this.username && this.isNewJoin) {
        console.log('Sending player joined request with username:', this.username);
        this.webSocketService.send(`/server/game/${this.gameId}/join`, {
          eventType: 'player.joined',
          payload: {
            username: this.username,
            gameId: this.gameId
          }
        });
        // Reset the flag after sending
        this.isNewJoin = false;
      }

      // Send request to get players list
      this.webSocketService.send(`/server/game/${this.gameId}`, 'game.get.players.request');

    }).catch((error) => {
      console.error('Failed to connect to WebSocket:', error);
      this.gameStatus = 'error';
    });
  }

  startGame(): void {
    if (!this.isHost) {
      console.warn('Only the host can start the game');
      return;
    }

    console.log('Starting game...');

    // Send start game request to server
    this.webSocketService.send(`/server/game/${this.gameId}`, 'game.start.request');
  }

  handleWebSocketMessage(message: WebSocketMessage): void {
    console.log('WebSocket message received:', message);

    switch (message.eventType) {
      case 'game.get.status.response':
        // Handle game status response
        if (message.payload) {
          this.gameStatus = message.payload.toLowerCase();
          console.log('Game status:', this.gameStatus);

          // Send request to get players
          this.webSocketService.send(`/server/game/${this.gameId}`, 'game.get.players.request');
        }
        break;

      case 'game.status.changed':
        // Handle real-time status changes
        if (message.payload && message.payload.status) {
          this.gameStatus = message.payload.status.toLowerCase();
          console.log('Game status changed to:', this.gameStatus);
        }
        break;

      case 'game.get.players.response':
        // Handle players list response
        if (message.payload) {
          this.players = Array.isArray(message.payload) ? message.payload : message.payload.players || [];
          console.log('Players:', this.players);

          // Check if current user is the first player (host)
          if (this.players.length > 0 && this.players[0] === this.username) {
            this.isHost = true;
          }
        }
        break;

      case 'player.joined':
        // Handle new player joining
        if (message.payload) {
          this.players.push(message.payload);
          console.log('New player joined:', message.payload);
        }
        break;

      case 'player.left':
        // Handle player leaving
        if (message.payload && message.payload.id) {
          this.players = this.players.filter(p => p.id !== message.payload.id);
          console.log('Player left:', message.payload);
        }
        break;

      case 'started':
        // Game has started - show question
        this.gameStatus = 'started';
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
        break;

      case 'stoped':
        this.gameStatus = 'ended'
        break;

      case 'next.question':
        // Handle next question
        if (message.payload) {
          this.Quetion = {
            que: message.payload.que,
            subject: message.payload.subject,
            options: message.payload.options,
            ans: message.payload.ans,
            type: message.payload.type
          };
          this.timeLimit = message.payload.timeLimit;
        }
        break;

      case 'game.ended':
        // Game has ended
        this.gameStatus = 'ended';
        console.log('Game ended');
        break;

      default:
        console.log('Unhandled event type:', message.eventType);
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
