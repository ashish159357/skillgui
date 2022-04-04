import { Component } from '@angular/core';
import { AuthService } from './Services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'quiz-new';
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
