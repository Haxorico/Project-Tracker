import { Injectable } from '@angular/core';
import { UserService } from './user.service';
import { User } from '../app/users/user.model';
import * as _ from "lodash";

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  constructor(private userService: UserService) {}

  Login(name: string, password: string) : boolean{
    name = name.toLowerCase();
    const users = this.userService.GetUsers();
    const userToFind = _.find(users, user => user.name.toLowerCase() == name && user.password == password )
    if (userToFind==undefined)
      return false;
    this.userService.SetCurrentUser(userToFind);
    return true;
  }

  GetGuestUser() : User{
    return this.userService.GetGuestUser();
  }

  Logout() {
    this.userService.SetCurrentUser(this.userService.GetGuestUser());
  }
}
