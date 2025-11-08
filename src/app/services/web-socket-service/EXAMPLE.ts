/**
 * EXAMPLE: How to use WebSocketService in any component
 * 
 * This file demonstrates various use cases for the WebSocketService.
 * Copy and adapt these examples to your components.
 */

import { Component, OnInit, OnDestroy } from '@angular/core';
import { WebSocketService, WebSocketMessage } from './web-socket.service';
import { Subscription } from 'rxjs';

// ============================================
// EXAMPLE 1: Simple Game Component
// ============================================
@Component({
  selector: 'app-simple-game',
  template: `<div>{{ gameStatus }}</div>`
})
export class SimpleGameExample implements OnInit, OnDestroy {
  gameStatus: string = 'Connecting...';
  private subscription?: Subscription;

  constructor(private wsService: WebSocketService) {}

  ngOnInit(): void {
    // Connect and subscribe to game updates
    this.wsService.connect().then(() => {
      this.subscription = this.wsService.subscribe('/topic/game/123')
        .subscribe((message: WebSocketMessage) => {
          if (message.eventType === 'game-update') {
            this.gameStatus = message.payload.status;
          }
        });
    });
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
    this.wsService.unsubscribe('/topic/game/123');
  }
}

// ============================================
// EXAMPLE 2: Chat Component
// ============================================
@Component({
  selector: 'app-chat',
  template: `
    <div *ngFor="let msg of messages">{{ msg.text }}</div>
    <input [(ngModel)]="newMessage" (keyup.enter)="sendMessage()">
  `
})
export class ChatExample implements OnInit, OnDestroy {
  messages: any[] = [];
  newMessage: string = '';
  private chatSubscription?: Subscription;

  constructor(private wsService: WebSocketService) {}

  ngOnInit(): void {
    this.wsService.connect().then(() => {
      // Subscribe to chat messages
      this.chatSubscription = this.wsService.subscribe('/topic/chat/room1')
        .subscribe((message: WebSocketMessage) => {
          if (message.eventType === 'new-message') {
            this.messages.push(message.payload);
          }
        });
    });
  }

  sendMessage(): void {
    if (this.newMessage.trim()) {
      this.wsService.send('/server/chat/send', {
        text: this.newMessage,
        room: 'room1',
        timestamp: new Date()
      });
      this.newMessage = '';
    }
  }

  ngOnDestroy(): void {
    this.chatSubscription?.unsubscribe();
    this.wsService.unsubscribe('/topic/chat/room1');
  }
}

// ============================================
// EXAMPLE 3: Multiple Subscriptions
// ============================================
@Component({
  selector: 'app-multi-subscription',
  template: `
    <div>Players: {{ players.length }}</div>
    <div>Score: {{ score }}</div>
  `
})
export class MultiSubscriptionExample implements OnInit, OnDestroy {
  players: any[] = [];
  score: number = 0;
  
  private playersSub?: Subscription;
  private scoreSub?: Subscription;

  constructor(private wsService: WebSocketService) {}

  ngOnInit(): void {
    this.wsService.connect().then(() => {
      // Subscribe to multiple topics
      this.playersSub = this.wsService.subscribe('/topic/game/players')
        .subscribe((message: WebSocketMessage) => {
          if (message.eventType === 'players-update') {
            this.players = message.payload;
          }
        });

      this.scoreSub = this.wsService.subscribe('/topic/game/score')
        .subscribe((message: WebSocketMessage) => {
          if (message.eventType === 'score-update') {
            this.score = message.payload.score;
          }
        });
    });
  }

  ngOnDestroy(): void {
    this.playersSub?.unsubscribe();
    this.scoreSub?.unsubscribe();
    this.wsService.unsubscribe('/topic/game/players');
    this.wsService.unsubscribe('/topic/game/score');
  }
}

// ============================================
// EXAMPLE 4: With Error Handling
// ============================================
@Component({
  selector: 'app-error-handling',
  template: `<div>{{ status }}</div>`
})
export class ErrorHandlingExample implements OnInit, OnDestroy {
  status: string = 'Disconnected';
  private subscription?: Subscription;

  constructor(private wsService: WebSocketService) {}

  ngOnInit(): void {
    this.connectWithRetry();
  }

  connectWithRetry(retries: number = 3): void {
    this.wsService.connect()
      .then(() => {
        this.status = 'Connected';
        this.subscription = this.wsService.subscribe('/topic/notifications')
          .subscribe(
            (message: WebSocketMessage) => {
              console.log('Notification:', message);
            },
            (error) => {
              console.error('Subscription error:', error);
              this.status = 'Error in subscription';
            }
          );
      })
      .catch((error) => {
        console.error('Connection failed:', error);
        this.status = 'Connection failed';
        
        if (retries > 0) {
          console.log(`Retrying... (${retries} attempts left)`);
          setTimeout(() => this.connectWithRetry(retries - 1), 2000);
        }
      });
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
    this.wsService.unsubscribe('/topic/notifications');
  }
}

// ============================================
// EXAMPLE 5: Conditional Connection
// ============================================
@Component({
  selector: 'app-conditional',
  template: `
    <button (click)="joinGame()">Join Game</button>
    <button (click)="leaveGame()">Leave Game</button>
  `
})
export class ConditionalExample implements OnDestroy {
  private gameSubscription?: Subscription;
  private currentGameId?: string;

  constructor(private wsService: WebSocketService) {}

  joinGame(gameId: string = '123'): void {
    this.currentGameId = gameId;
    
    this.wsService.connect().then(() => {
      // Subscribe to game
      this.gameSubscription = this.wsService
        .subscribe(`/topic/game/${gameId}`)
        .subscribe((message: WebSocketMessage) => {
          console.log('Game event:', message);
        });

      // Send join request
      this.wsService.send(`/server/game/${gameId}/join`, {
        action: 'join',
        timestamp: new Date()
      });
    });
  }

  leaveGame(): void {
    if (this.currentGameId) {
      // Send leave request
      this.wsService.send(`/server/game/${this.currentGameId}/leave`, {
        action: 'leave'
      });

      // Unsubscribe
      this.gameSubscription?.unsubscribe();
      this.wsService.unsubscribe(`/topic/game/${this.currentGameId}`);
      this.currentGameId = undefined;
    }
  }

  ngOnDestroy(): void {
    this.leaveGame();
  }
}

// ============================================
// EXAMPLE 6: Using with Async Pipe
// ============================================
@Component({
  selector: 'app-async-example',
  template: `
    <div *ngFor="let update of gameUpdates$ | async">
      {{ update.eventType }}: {{ update.payload }}
    </div>
  `
})
export class AsyncPipeExample implements OnInit, OnDestroy {
  gameUpdates$?: any;

  constructor(private wsService: WebSocketService) {}

  ngOnInit(): void {
    this.wsService.connect().then(() => {
      // Use Observable directly with async pipe
      this.gameUpdates$ = this.wsService.subscribe('/topic/game/updates');
    });
  }

  ngOnDestroy(): void {
    this.wsService.unsubscribe('/topic/game/updates');
  }
}

