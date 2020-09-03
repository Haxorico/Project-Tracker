import { Injectable } from '@angular/core';
import { UserService } from './user.service';
import { User } from '../app/users/user.model';

import * as _ from "lodash";
import {Md5} from 'ts-md5/dist/md5';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  constructor(private userService: UserService) {}

  Login(name: string, password: string) : boolean{
    password = Md5.hashStr(password).toString();
    name = name.toLowerCase();
    const users = this.userService.GetUsers();
    const u = _.find(users, user => user.name.toLowerCase() == name && user.password == password )
    if (u==undefined)
      return false;
    this.userService.SetCurrentUser(u);
    return true;
  }

  GetGuestUser() : User{
    return this.userService.GetGuestUser();
  }

  Logout() {
    this.userService.SetCurrentUser(this.userService.GetGuestUser());
  }
}
