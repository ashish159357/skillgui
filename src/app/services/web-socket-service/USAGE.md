# WebSocket Service Usage Guide

This is a generic WebSocket service that uses SockJS and STOMP protocol. It can be used in any component throughout the application.

## Features

- ✅ Singleton service (shared connection across components)
- ✅ Automatic connection management
- ✅ Multiple topic subscriptions
- ✅ Type-safe message handling
- ✅ Observable-based API
- ✅ Automatic cleanup support

## Basic Usage

### 1. Import the Service

```typescript
import { WebSocketService, WebSocketMessage } from 'src/app/services/web-socket-service/web-socket.service';
import { Subscription } from 'rxjs';
```

### 2. Inject in Constructor

```typescript
constructor(private webSocketService: WebSocketService) {}
```

### 3. Connect and Subscribe

```typescript
export class YourComponent implements OnInit, OnDestroy {
  private subscription?: Subscription;

  ngOnInit(): void {
    // Connect to WebSocket
    this.webSocketService.connect().then(() => {
      // Subscribe to a topic
      this.subscription = this.webSocketService.subscribe('/topic/your-topic')
        .subscribe((message: WebSocketMessage) => {
          console.log('Received:', message);
          
          // Handle different event types
          if (message.eventType === 'your-event') {
            // Handle your event
            console.log('Payload:', message.payload);
          }
        });
    });
  }

  ngOnDestroy(): void {
    // Clean up subscription
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    this.webSocketService.unsubscribe('/topic/your-topic');
  }
}
```

## API Reference

### Methods

#### `connect(): Promise<any>`
Connects to the WebSocket server. Returns a promise that resolves when connected.

```typescript
this.webSocketService.connect()
  .then(() => console.log('Connected'))
  .catch(error => console.error('Connection failed', error));
```

#### `subscribe(topic: string): Observable<WebSocketMessage>`
Subscribe to a specific topic. Returns an Observable that emits messages.

```typescript
this.webSocketService.subscribe('/topic/game/123')
  .subscribe(message => {
    console.log('Message:', message);
  });
```

#### `send(destination: string, body: any, headers?: any): void`
Send a message to a destination.

```typescript
// Send string message
this.webSocketService.send('/server/game/123', 'hello');

// Send object (will be automatically stringified)
this.webSocketService.send('/server/game/123', { action: 'join', player: 'John' });

// Send with headers
this.webSocketService.send('/server/game/123', 'message', { priority: 'high' });
```

#### `unsubscribe(topic: string): void`
Unsubscribe from a topic.

```typescript
this.webSocketService.unsubscribe('/topic/game/123');
```

#### `disconnect(): void`
Disconnect from WebSocket server and clean up all subscriptions.

```typescript
this.webSocketService.disconnect();
```

#### `isWebSocketConnected(): boolean`
Check if WebSocket is currently connected.

```typescript
if (this.webSocketService.isWebSocketConnected()) {
  console.log('Connected');
}
```

## Message Format

Messages received from the WebSocket follow this interface:

```typescript
interface WebSocketMessage {
  eventType: string;  // Type of event (e.g., 'started', 'player-joined')
  payload: any;       // Event data
}
```

## Complete Example

```typescript
import { Component, OnInit, OnDestroy } from '@angular/core';
import { WebSocketService, WebSocketMessage } from 'src/app/services/web-socket-service/web-socket.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-game-lobby',
  templateUrl: './game-lobby.component.html'
})
export class GameLobbyComponent implements OnInit, OnDestroy {
  private gameSubscription?: Subscription;
  private chatSubscription?: Subscription;
  
  players: any[] = [];
  messages: any[] = [];

  constructor(private webSocketService: WebSocketService) {}

  ngOnInit(): void {
    this.connectToGame();
  }

  connectToGame(): void {
    this.webSocketService.connect().then(() => {
      // Subscribe to game events
      this.gameSubscription = this.webSocketService
        .subscribe('/topic/game/lobby')
        .subscribe((message: WebSocketMessage) => {
          this.handleGameEvent(message);
        });

      // Subscribe to chat
      this.chatSubscription = this.webSocketService
        .subscribe('/topic/chat/lobby')
        .subscribe((message: WebSocketMessage) => {
          this.handleChatMessage(message);
        });

      // Send join request
      this.webSocketService.send('/server/game/join', {
        username: 'Player1',
        gameId: 'lobby'
      });
    });
  }

  handleGameEvent(message: WebSocketMessage): void {
    switch (message.eventType) {
      case 'player-joined':
        this.players.push(message.payload);
        break;
      case 'player-left':
        this.players = this.players.filter(p => p.id !== message.payload.id);
        break;
      case 'game-started':
        console.log('Game starting!', message.payload);
        break;
    }
  }

  handleChatMessage(message: WebSocketMessage): void {
    if (message.eventType === 'chat-message') {
      this.messages.push(message.payload);
    }
  }

  sendChatMessage(text: string): void {
    this.webSocketService.send('/server/chat/send', {
      text: text,
      sender: 'Player1'
    });
  }

  ngOnDestroy(): void {
    // Clean up subscriptions
    if (this.gameSubscription) {
      this.gameSubscription.unsubscribe();
    }
    if (this.chatSubscription) {
      this.chatSubscription.unsubscribe();
    }
    
    // Unsubscribe from topics
    this.webSocketService.unsubscribe('/topic/game/lobby');
    this.webSocketService.unsubscribe('/topic/chat/lobby');
  }
}
```

## Best Practices

1. **Always implement OnDestroy**: Clean up subscriptions to prevent memory leaks
2. **Handle connection errors**: Use try-catch or promise rejection handlers
3. **Unsubscribe from topics**: Call `unsubscribe()` when component is destroyed
4. **Check connection status**: Use `isWebSocketConnected()` before sending messages
5. **Use typed messages**: Define interfaces for your message payloads for better type safety

## Environment Configuration

The WebSocket URL is configured in `src/environments/environment.ts`:

```typescript
export const environment = {
  webSocketUrl: 'http://localhost:8082/ws'
};
```

