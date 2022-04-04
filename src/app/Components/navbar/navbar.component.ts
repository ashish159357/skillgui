import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  menu:string|undefined;

  constructor() { }

  ngOnInit(): void {
  }

  openMenu(){
    this.menu="true";
  }
  closeMenu(){
    this.menu=undefined;
  }

}
