import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/Services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  isUser:any=localStorage.getItem('isUserLoggedIn');

  constructor(private authService: AuthService) {}

  ngOnInit() {
    let storeData = localStorage.getItem("isUserLoggedIn");
    console.log("StoreData: " + storeData);

    if( storeData != null && storeData == "true")
       this.isUser = localStorage.getItem("isUserLoggedIn");
    else
       this.isUser = localStorage.getItem("isUserLoggedIn");
 }

}
