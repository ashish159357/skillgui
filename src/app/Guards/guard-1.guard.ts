import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Guard1Guard implements CanActivate {
  router: any;
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    let url: string = state.url;

    return this.checkLogin(url);

  }


  checkLogin(url: string): true | UrlTree|false {
    console.log("Url: " + url)
    let val: string | null = localStorage.getItem('isUserLoggedIn');

    if (val != null && val == "true") {
      if (url == "/login")
        this.router.parseUrl('/home');
      else
        return true;
    } else {
      return this.router.parseUrl('/login');
    }
    return false
  }

}
