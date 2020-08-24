import { Injectable } from '@angular/core';
import { UserService } from '../users/user.service';
import { User } from '../users/user.model';
import { Subscription, Subject } from 'rxjs';
//import { find } from 'lodash';
import * as _ from "lodash";

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  /* loginChanged = new Subject<User>(); */
  constructor(private userService: UserService) {

  }

  Login(name: string, password: string) : boolean {
    const users = this.userService.GetUsers();
    var debug = _.find(users, user => user.name.toLowerCase() == name && user.password == password )
    if (debug==undefined)
      return false;
    this.userService.SetCurrentUser(debug);
    return true;
    /* for (let i = 0; i < users.length; i++) {
      if (users[i].name.toLowerCase() == name && users[i].password == password) {
        //this.loggedUser = users[i];
        this.userService.SetCurrentUser(users[i]);
        this.loginChanged.next();
        return true;
      }
    } 
    return false; */
  }

  GetGuestUser() : User
  {
    return this.userService.GetGuestUser();
  }

  Logout() {
    /* this.loggedUser = this.GetGuestUser();
    this.loginChanged.next(this.loggedUser); */
    this.userService.SetCurrentUser(this.userService.GetGuestUser());
  }

  /* GetLogedUser() {
    return this.loggedUser;
  } */
}
