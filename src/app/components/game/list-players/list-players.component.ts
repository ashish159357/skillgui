import { Component, OnInit } from '@angular/core';


import { HttpClient } from '@angular/common/http';

interface Player {
  name: string;
}


@Component({
  selector: 'app-list-players',
  templateUrl: './list-players.component.html',
  styleUrls: ['./list-players.component.css']
})
export class ListPlayersComponent implements OnInit {

  players: Player[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit() {
    // Example backend call
    this.http.get<Player[]>('http://localhost:8080/api/players').subscribe({
      next: (data) => (this.players = data),
      error: (err) => console.error('Failed to load players', err),
    });
  }


}
