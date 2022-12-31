import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/Services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  menu:string|undefined;

  isUserLoggedIn=localStorage.getItem("isUserLoggedIn");

  constructor(private authservice:AuthService,private router : Router) { }

  ngOnInit(): void {
  }

  /*
  openMenu(){
    this.menu="true";
  }
  closeMenu(){
    this.menu=undefined;
  }*/
  

  MenuControll(){
    if(this.menu){
      this.menu=undefined
    }
    else{
      this.menu="true"
    }
  }


  logo(){
    
    this.authservice.logout()
   

  }

}
