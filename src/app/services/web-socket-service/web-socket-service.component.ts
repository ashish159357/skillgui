import { Component, OnInit } from '@angular/core';
import { WebSocketSubject, webSocket } from 'rxjs/webSocket';

@Component({
  selector: 'app-web-socket-service',
  templateUrl: './web-socket-service.component.html',
  styleUrls: ['./web-socket-service.component.css']
})
export class WebSocketServiceComponent implements OnInit {

  private socket$: WebSocketSubject<any>;

  constructor() {
    this.socket$ = webSocket('ws://your-websocket-url'); // Replace with your WebSocket server URL
  }
  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }

  public connect(): void {
    this.socket$.subscribe(
      (message) => {
        console.log('Received message:', message);
        // Handle incoming messages here
      },
      (err) => {
        console.error('WebSocket error:', err);
        // Handle WebSocket errors here
      }
    );
  }


}
