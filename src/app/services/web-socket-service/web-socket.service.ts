import { Injectable } from '@angular/core';
import { Observable, Subject, Subscription } from 'rxjs';
import * as SockJs from 'sockjs-client';
import * as Stomp from 'stompjs';
import { environment } from 'src/environments/environment';

export interface WebSocketMessage {
  eventType: string;
  payload: any;
}

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {

  private stompClient: any;
  private isConnected: boolean = false;
  private subscriptions: Map<string, Subscription> = new Map();
  private messageSubjects: Map<string, Subject<WebSocketMessage>> = new Map();

  constructor() { }

  /**
   * Connect to WebSocket server
   * @returns Promise that resolves when connection is established
   */
  public connect(): Promise<any> {
    return new Promise((resolve, reject) => {
      if (this.isConnected) {
        resolve(this.stompClient);
        return;
      }

      const ws = SockJs(environment.webSocketUrl);
      this.stompClient = Stomp.over(ws);

      // Disable debug logging (optional)
      this.stompClient.debug = null;

      this.stompClient.connect(
        {},
        (frame: any) => {
          console.log('WebSocket Connected:', frame);
          this.isConnected = true;
          resolve(this.stompClient);
        },
        (error: any) => {
          console.error('WebSocket Connection Error:', error);
          this.isConnected = false;
          reject(error);
        }
      );
    });
  }

  /**
   * Subscribe to a topic
   * @param topic - The topic to subscribe to (e.g., '/topic/game/123')
   * @returns Observable that emits messages from the topic
   */
  public subscribe(topic: string): Observable<WebSocketMessage> {
    if (!this.messageSubjects.has(topic)) {
      this.messageSubjects.set(topic, new Subject<WebSocketMessage>());
    }

    const messageSubject = this.messageSubjects.get(topic)!;

    if (!this.isConnected) {
      this.connect().then(() => {
        this.subscribeToTopic(topic, messageSubject);
      });
    } else {
      this.subscribeToTopic(topic, messageSubject);
    }

    return messageSubject.asObservable();
  }

  /**
   * Internal method to subscribe to a topic
   */
  private subscribeToTopic(topic: string, messageSubject: Subject<WebSocketMessage>): void {
    if (this.subscriptions.has(topic)) {
      return; // Already subscribed
    }

    const subscription = this.stompClient.subscribe(topic, (message: any) => {
      try {
        const parsedMessage: WebSocketMessage = JSON.parse(message.body);
        messageSubject.next(parsedMessage);
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    });

    this.subscriptions.set(topic, subscription);
  }

  /**
   * Unsubscribe from a topic
   * @param topic - The topic to unsubscribe from
   */
  public unsubscribe(topic: string): void {
    const subscription = this.subscriptions.get(topic);
    if (subscription) {
      subscription.unsubscribe();
      this.subscriptions.delete(topic);
    }

    const messageSubject = this.messageSubjects.get(topic);
    if (messageSubject) {
      messageSubject.complete();
      this.messageSubjects.delete(topic);
    }
  }

  /**
   * Send a message to a destination
   * @param destination - The destination to send to (e.g., '/server/game/123')
   * @param body - The message body (will be stringified if object)
   * @param headers - Optional headers
   */
  public send(destination: string, body: any = {}, headers: any = {}): void {
    if (!this.isConnected) {
      console.error('WebSocket is not connected. Cannot send message.');
      return;
    }

    const messageBody = typeof body === 'string' ? body : JSON.stringify(body);
    this.stompClient.send(destination, headers, messageBody);
  }

  /**
   * Disconnect from WebSocket server
   */
  public disconnect(): void {
    if (this.stompClient && this.isConnected) {
      // Unsubscribe from all topics
      this.subscriptions.forEach((subscription, topic) => {
        subscription.unsubscribe();
      });
      this.subscriptions.clear();

      // Complete all message subjects
      this.messageSubjects.forEach((subject) => {
        subject.complete();
      });
      this.messageSubjects.clear();

      // Disconnect STOMP client
      this.stompClient.disconnect(() => {
        console.log('WebSocket Disconnected');
      });

      this.isConnected = false;
    }
  }

  /**
   * Check if WebSocket is connected
   */
  public isWebSocketConnected(): boolean {
    return this.isConnected;
  }
}
