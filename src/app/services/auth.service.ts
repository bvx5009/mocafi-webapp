import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor() { }

  public isLoggedIn(): boolean {
   var isLoggedin = localStorage.getItem('isLoggedIn');
   return (JSON.parse(isLoggedin!) === true)
  }

  setLocalStorage() {
    localStorage.setItem('isLoggedIn', "true");
  }

  logout() {
    localStorage.clear();
  }

}
