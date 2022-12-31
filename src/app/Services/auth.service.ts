import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
//import { delay, Observable, of, tap } from 'rxjs-compat';
//import {  Observable} from 'rxjs-compat';
//import { Observable } from 'rxjs/dist/types/internal/Observable';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  isUserLoggedIn: boolean = false;

  login(userName: string | undefined, password: string | undefined): any {
    console.log(userName);
    console.log(password);
    this.isUserLoggedIn = userName == 'admin' && password == 'admin';
    localStorage.setItem('isUserLoggedIn', this.isUserLoggedIn ? "true" : "false");

    return localStorage.getItem("isUserLoggedIn");
  }


  logout(): void  {
    this.isUserLoggedIn = false;
    localStorage.removeItem('isUserLoggedIn');
    
  }


  constructor(private router : Router) { }
}
